import { View, Text, ActivityIndicator } from "react-native";
import { Button, Card, Chip, Modal, Portal, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { authApi, endpoints } from "../../../utils/Apis";
import { useContext, useEffect, useState } from "react";
import { MyUserContext } from "../../../configs/MyUserContext";
import { FlatList } from "react-native";
import MyStyles from "../../../styles/MyStyles";
import moment from "moment";

const Admin = () => {
    const navigation = useNavigation();
    const user = useContext(MyUserContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [filterVisible, setFilterVisible] = useState(false);
    const [username, setUsername] = useState("");
    const [dateText, setDateText] = useState("");


    const loadOrders = async () => {
        try {
            setLoading(true);
            const res = await authApi(user.token).get(endpoints['orders']);
            setOrders(res.data);
            setFilteredOrders(res.data);
        } catch (err) {
            console.error(err);
            setOrders([]);
            setFilteredOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const applyFilter = () => {
        let data = [...orders];

        if (username.trim()) {
            data = data.filter(o =>
                o.user?.toLowerCase().includes(username.toLowerCase())
            );
        }

        if (dateText.trim()) {
            data = data.filter(o =>
                o.created_date?.startsWith(dateText)
            );
        }

        setFilteredOrders(data);
        setFilterVisible(false);
    };



    useEffect(() => {
        loadOrders();
    }, []);

    const renderItem = ({ item }) => {
        const statusText =
            item.status === 1 ? "Thành công" :
                item.status === 2 ? "Thất bại" : "Đang xử lý";

        return (
            <Card style={{ margin: 8 }}>
                <Card.Content>
                    <Text variant="titleMedium"> Giao dịch {item.id} </Text>

                    <Text> Người dùng: {item.user ?? "-"} </Text>

                    <Text> Khóa học: {item.course_info?.subject ?? "-"} </Text>

                    <Text> Số tiền: {item.total_amount ?? 0} VNĐ </Text>

                    <Text> Ngày: {moment(item.created_date).format("DD/MM/YYYY, h:mm:ss ")} </Text>

                    <View style={{ flexDirection: "row", marginTop: 8 }}>
                        <Chip style={{ marginRight: 8 }}> {item.payment_method ?? "-"} </Chip>
                        <Chip> {statusText} </Chip>
                    </View>
                </Card.Content>
            </Card>
        );
    };

    return (
        <>
            <Button mode="contained" style={{ margin: 10 }} onPress={() => setFilterVisible(true)}>
            Tra cứu </Button>

            <FlatList ListFooterComponent={loading && <ActivityIndicator />} data={filteredOrders} keyExtractor={item => item.id.toString()} renderItem={renderItem}
                ListEmptyComponent={
                    <Text style={{ textAlign: "center", marginTop: 20 }}>
                        Không có giao dịch nào
                    </Text>
                }
            />

            <Portal>
                <Modal visible={filterVisible} onDismiss={() => setFilterVisible(false)}>
                    <Card style={[MyStyles.margin, MyStyles.padding]}>
                        <Text style={{ fontSize: 18, marginBottom: 10 }}> Tra cứu giao dịch </Text>

                        <TextInput label="Tên người dùng" value={username} onChangeText={setUsername} />
                        <TextInput
                            label="Ngày giao dịch (YYYY-MM-DD)"
                            value={dateText}
                            onChangeText={setDateText}
                            placeholder="2026-01-09"
                        />

                        <Button mode="contained" onPress={applyFilter}>
                            Áp dụng
                        </Button>
                    </Card>
                </Modal>
            </Portal>
        </>
    );

}

export default Admin;
