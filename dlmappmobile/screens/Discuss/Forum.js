import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Apis, { authApi, endpoints } from "../../utils/Apis";
import { Card, FAB, List, Searchbar } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { MyUserContext } from "../../configs/MyUserContext";
import moment from "moment";
import "moment/locale/vi";


const Forum = ({ route }) => {
    const navigation = useNavigation();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);
    const lessonId = route.params?.lessonId;
    
    const user = useContext(MyUserContext);

    const loadQuestions = async () => {
        try {
            setLoading(true)

            let url = `${endpoints['questions']}?lesson=${lessonId}`;
            


            if (q) {
                url = `${url}&q=${q}`
            }
            console.info(url);
            console.log("TOKEN IN FORUM =", global.userToken);

            let res;
            if (user && user.token) {
                res = await authApi(user.token).get(url);
            } else {
                res = await Apis.get(url);
            }
            setQuestions(res.data)


        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            if (lessonId)
                loadQuestions();
        }, [])
    );

    useEffect(() => {
        let timer = setTimeout(() => {
            loadQuestions();
        }, 500);

        return () => clearTimeout(timer);
    }, [q, page]);

    useEffect(() => {
        setPage(1);
    }, [q])

    const loadMore = () => {
        if (page > 0 && !loading)
            setPage(page + 1);
    }

    return (
        <>
        <Text style={[MyStyles.title, {marginVertical: 12, marginLeft: 100}]}>Câu hỏi thảo luận ?</Text>
            <Searchbar placeholder="Tim kiếm .... " style={[MyStyles.margin, MyStyles.marginBottom]} value={q} onChangeText={setQ} />
            <FlatList ListFooterComponent={loading && <ActivityIndicator size="large" />} data={questions} onEndReached={loadMore}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => { }} style={[MyStyles.padding]} >
                        <Card style={[MyStyles.margin]}>
                            <Card.Title
                                title={item.created_by.first_name}
                                right={() => (
                                    <Text style={{ marginRight: 12, color: "#888", fontSize: 12 }}>
                                        {moment(item.created_date).fromNow()}
                                    </Text>
                                )}
                            />
                            <Card.Content>
                                <Text numberOfLines={2}>{item.content}</Text>
                            </Card.Content>
                            <Card.Actions>
                                <Text>Trả lời: {item.answer_count}</Text>
                            </Card.Actions>
                        </Card>
                    </TouchableOpacity>
                )} />
            <FAB icon="plus"
                style={{ position: "absolute", right: 16, bottom: 16, backgroundColor: "#dddbe7ff" }}
                onPress={() => navigation.navigate("Add question", { lessonId })}
            />
        </>
    );
}

export default Forum;