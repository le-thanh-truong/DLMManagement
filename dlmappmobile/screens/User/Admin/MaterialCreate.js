import { View, Text, Alert } from "react-native";
import { Button, TextInput } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import { useContext, useState } from "react";
import { MyUserContext } from "../../../configs/MyUserContext";
import { authApi, endpoints } from "../../../utils/Apis";

const MaterialCreate = ({ navigation }) => {
    const user = useContext(MyUserContext);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [lesson, setLesson] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const pickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "*/*",
                copyToCacheDirectory: true,
            });

            if (!result.canceled) {
                setFile(result.assets[0]);
            }
        } catch (err) {
            console.error("Pick file error", err);
        }
    };

    const uploadMaterial = async () => {

        if (!lesson || isNaN(lesson)) {
            Alert.alert("Lỗi", "Lesson ID không hợp lệ");
            return;
        }

        if (!name || !lesson || !file) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
            return;
        }

        const form = new FormData();
        form.append("name", name);
        form.append("description", description);
        form.append("lesson", Number(lesson));
        form.append("material_type", 2);
        form.append("level", 1);         

        form.append("file", {
            uri: file.uri,
            name: file.name,
            type: file.mimeType || "application/octet-stream",
        });

        try {
            setLoading(true);

            await authApi(user.token).post( endpoints.materials,
                form,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            Alert.alert("Thành công", "Upload tài liệu thành công");
            navigation.goBack();
        } catch (err) {
            console.error(err.response?.data || err);
            Alert.alert("Lỗi", "Upload thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ padding: 10 }}>
            <TextInput label="Tên tài liệu" value={name} onChangeText={setName}
                style={{ marginBottom: 10 }}
            />

            <TextInput label="Mô tả" value={description} onChangeText={setDescription} multiline
                style={{ marginBottom: 10 }}
            />

            <TextInput label="Lesson ID" value={lesson} onChangeText={setLesson} keyboardType="numeric" style={{ marginBottom: 10 }} />

            <Button mode="outlined" onPress={pickFile}>
                {file ? file.name : "Chọn file tài liệu"}
            </Button>

            <Button mode="contained" loading={loading} style={{ marginTop: 15 }} onPress={uploadMaterial}>
                Upload
            </Button>
        </View>
    );
};

export default MaterialCreate;
