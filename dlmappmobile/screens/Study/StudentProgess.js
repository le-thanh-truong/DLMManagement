import { ActivityIndicator, Text, View } from "react-native";
import { ScrollView } from "react-native";
import Styles from "./Styles";
import { Card, Icon, ProgressBar } from "react-native-paper";
import { useContext, useEffect, useState } from "react";
import { MyUserContext } from "../../configs/MyUserContext";
import Apis, { authApi, endpoints } from "../../utils/Apis";


const StudentProgess = () => {
    const user = useContext(MyUserContext);
    const [loading, setLoading] = useState(true);
    const [progressList, setProgressList] = useState([]);

    const loadProgress = async () => {
        try {
            setLoading(true)
            let res;
            if (user && user.token) {
                res = await authApi(user.token).get(endpoints['learning-progress']);
            } else {
                res = await Apis.get(url);
            }
            setProgressList(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadProgress();
    }, [])

    if (loading)
        return <ActivityIndicator size="large" style={{ marginTop: 30 }} />;

    const totalMaterials = progressList.length;

    const completedMaterials = progressList.filter(
        p => p.is_completed || p.progress_percent === 100
    ).length;

    const totalStudyTime = progressList.reduce(
        (sum, p) => sum + (p.study_duration || 0),
        0
    );

    const avgProgress =
        totalMaterials > 0
            ? Math.round((completedMaterials / totalMaterials) * 100)
            : 0;

    return (
        <ScrollView style={Styles.container}>

            <Text style={Styles.title}> <Icon source="chart-bar" size={30} color="blue" /> Dashboard học tập</Text>

            <View style={Styles.Row}>
                <Card style={Styles.Card}>
                    <Text> <Icon source="clock-edit-outline" size={15} color="red" /> Giờ học</Text>
                    <Text style={Styles.Value}>{Math.round(totalStudyTime / 60)} giờ</Text>
                </Card>

                <Card style={Styles.Card}>
                    <Text> <Icon source="text-box-edit-outline" size={15} color="red" /> Tài liệu</Text>
                    <Text style={Styles.Value}>{completedMaterials} / {totalMaterials}</Text>
                </Card>
            </View>

            <Card style={Styles.progressCard}>
                <Text>Hoàn thành trung bình</Text>
                <ProgressBar progress={avgProgress / 100} />
                <Text>{avgProgress}%</Text>
            </Card>
        </ScrollView>
    );

}
export default StudentProgess;