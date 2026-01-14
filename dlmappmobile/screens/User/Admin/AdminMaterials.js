import { View, Text, FlatList, ActivityIndicator, Linking } from "react-native";
import { Card, Chip, Button } from "react-native-paper";
import { useContext, useEffect, useState } from "react";
import { MyUserContext } from "../../../configs/MyUserContext";
import { authApi, endpoints } from "../../../utils/Apis";
import { useNavigation } from "@react-navigation/native";

const AdminMaterials = () => {
    const navigation = useNavigation();
    const user = useContext(MyUserContext);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadMaterials = async () => {
        try {
            setLoading(true);
            const res = await authApi(user.token).get(endpoints['materials']);
            setMaterials(res.data);
        } catch (err) {
            console.error(err);
            setMaterials([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMaterials();
    }, []);

    if (loading)
        return <ActivityIndicator style={{ marginTop: 30 }} />;

    return (
        <View style={{ flex: 1 }}>
            <Button mode="contained" style={{ margin: 10 }} onPress={() => navigation.navigate("MaterialCreate")}>
                + Thêm tài liệu
            </Button>

            <FlatList
                data={materials}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <Card style={{ margin: 8 }}>
                        <Card.Content>
                            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                                {item.name}
                            </Text>

                            <Text>Loại: {item.material_type}</Text>
                            <Text>Level: {item.level}</Text>
                            <Text>Bài học: {item.lesson?.subject ?? "-"}</Text>
                            <Text>Upload bởi: {item.uploaded_by ?? "-"}</Text>
                        </Card.Content>
                    </Card>
                )}
            />
        </View>
    );
};

export default AdminMaterials;
