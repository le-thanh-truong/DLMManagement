import { useContext, useState } from "react";
import Apis, { authApi, endpoints } from "../../utils/Apis";
import { Text, TextInput, View } from "react-native";
import { Button } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";
import { MyUserContext } from "../../configs/MyUserContext";

const AddQuestion = ({ route, navigation }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const lessonId = route.params?.lessonId;
    const user = useContext(MyUserContext);

    const submitQuestion = async () => {
        if (!title || !content)
            return alert("Vui lòng nhập đầy đủ");

        try {
            let res;
            if (user && user.token) {
                res = await authApi(user.token).post(endpoints.questions, {
                    title,
                    content,
                    lesson: lessonId
                });
            } else {
                res = await Apis.post(endpoints.questions, {
                    title,
                    content,
                    lesson: lessonId
                });
            }

            navigation.goBack();

        } catch (err) {
            console.error(err);
            alert("Không thể đăng câu hỏi");
        }
    };

    return (
        <View style={MyStyles.padding}>
            <Text variant="titleMedium" style={MyStyles.marginBottom}> Đặt câu hỏi</Text>

            <TextInput placeholder="Tiêu đề" value={title} onChangeText={setTitle} style={MyStyles.margin} />

            <TextInput
                placeholder="Nội dung" value={content} onChangeText={setContent} 
                numberOfLines={5} style={MyStyles.marginBottom}/>

            <Button mode="contained" onPress={submitQuestion}>Đăng câu hỏi</Button>
        </View>
    );
};

export default AddQuestion;