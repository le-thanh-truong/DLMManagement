import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { Card, Chip } from "react-native-paper";
import { useContext, useEffect, useState } from "react";
import { MyUserContext } from "../../../configs/MyUserContext";
import { authApi, endpoints } from "../../../utils/Apis";

const AdminStats = () => {
    const user = useContext(MyUserContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadStats = async () => {
        try {
            setLoading(true);
            const res = await authApi(user.token).get(endpoints['stats/student-stats']);
            setStats(res.data);
        } catch (err) {
            console.error(err);
            setStats(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    if (loading) return <ActivityIndicator style={{ marginTop: 30 }} />;

    if (!stats)
        return <Text style={{ textAlign: "center" }}>Không có dữ liệu thống kê</Text>;

    return (
        <ScrollView style={{ padding: 10 }}>
            <Card style={{ marginBottom: 10 }}>
                <Card.Content>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                        Tổng doanh thu
                    </Text>
                    <Text style={{ fontSize: 22, color: "green", marginTop: 5 }}>
                        {stats.total_revenue?.toLocaleString()} VNĐ
                    </Text>
                </Card.Content>
            </Card>

            <Card style={{ marginBottom: 10 }}>
                <Card.Content>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                        Phân loại người dùng
                    </Text>

                    {stats.user_demographics?.map((u, index) => (
                        <Chip key={index} style={{ marginTop: 5 }}>
                            {u.role === 1
                                ? "Admin"
                                : u.role === 2
                                ? "Giảng viên"
                                : "Sinh viên"}: {u.count}
                        </Chip>
                    ))}
                </Card.Content>
            </Card>

            <Card>
                <Card.Content>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                        Top khóa học nhiều học viên
                    </Text>

                    {stats.top_courses?.map((c, index) => (
                        <Text key={index} style={{ marginTop: 6 }}>
                            {index + 1}. {c.subject} – {c.students} học viên
                        </Text>
                    ))}
                </Card.Content>
            </Card>
        </ScrollView>
    );
};

export default AdminStats;
