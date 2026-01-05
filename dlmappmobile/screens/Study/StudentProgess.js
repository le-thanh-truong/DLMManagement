import { Text, View } from "react-native";
import { ScrollView } from "react-native";
import Styles from "./Styles";
import { Card, Icon, ProgressBar } from "react-native-paper";

const Data = {
    totalHours: 42,
    materialsViewed: 120,
    avg: 0.78,
    courses: [
        { id: 1, name: "Trí tuệ nhân tạo", progress: 0.85 },
        { id: 2, name: "Tiếng anh Toiec", progress: 0.65 },
    ],
};

const StudentProgess = () => {
    return (
        <ScrollView style={Styles.container}>
            
            <Text style={Styles.title}> <Icon source="chart-bar" size={30} color="blue"/> Dashboard học tập</Text>

            <View style={Styles.Row}>
                <Card style={Styles.Card}>
                    <Text> <Icon source="clock-edit-outline" size={15} color="red"/> Giờ học</Text>
                    <Text style={Styles.Value}>{Data.totalHours}</Text>
                </Card>

                <Card style={Styles.Card}>
                    <Text> <Icon source="text-box-edit-outline" size={15} color="red"/> Tài liệu</Text>
                    <Text style={Styles.Value}>{Data.materialsViewed}</Text>
                </Card>
            </View>

            <Card style={Styles.progressCard}>
                <Text>Hoàn thành trung bình</Text>
                <ProgressBar progress={Data.avg} />
                <Text>{Math.round(Data.avg * 100)}%</Text>
            </Card>

            <Text style={Styles.subtitle}><Icon source="database-edit" size={30} color="blue"/> Khóa học của bạn</Text>

            {Data.courses.map(course => (
                <Card key={course.id} style={Styles.courseCard}>
                    <Text>{course.name}</Text>
                    <ProgressBar progress={course.progress} />
                    <Text>{Math.round(course.progress * 100)}%</Text>
                </Card>
            ))}
        </ScrollView>
    );

}
export default StudentProgess;