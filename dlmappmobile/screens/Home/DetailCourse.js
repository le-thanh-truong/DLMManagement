import { useContext, useEffect, useState } from "react";
import Apis, { authApi, endpoints } from "../../utils/Apis";
import { Alert, Image, Text, View } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { ActivityIndicator } from "react-native";
import { Button } from "react-native-paper";
import { MyUserContext } from "../../configs/MyUserContext";
import { useNavigation } from "@react-navigation/native";


const DetailCourse = ({ route }) => {
    const [course, setCourses] = useState(null);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const courseId = route.params?.courseId;
    const user = useContext(MyUserContext);

    const loadDetail = async () => {
        try {
            setLoading(true)

            let res = await Apis.get(`${endpoints['courses']}${courseId}/`);

            setCourses(res.data)

        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDetail();
    }, [courseId])

    if (loading) {
        return (
            <View style={MyStyles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!course) {
        return (
            <View style={MyStyles.container}>
                <Text>Không tìm thấy khóa học</Text>
            </View>
        );
    }


    return (
        <>
            <View style={[MyStyles.header, { marginTop: 38 }]}>
                <Image source={course.image ? { uri: course.image } : require('../../assets/images/memecat2.jpg')} style={[MyStyles.avatar]} />
                <View style={MyStyles.textContainer}>
                    <Text style={MyStyles.title}>{course.subject}</Text>
                    <View style={MyStyles.row}>
                        <Text style={[MyStyles.context, MyStyles.textContainer]}>Khóa học số: </Text>
                        <Text style={[MyStyles.context, MyStyles.textContainer]}>Bài học: </Text>
                    </View>
                </View>
            </View>
            <View>
                <Text style={[MyStyles.padding, { fontSize: 18 }]}>Giới thiệu: </Text>
                <Text style={[MyStyles.padding]}>{course.description}</Text>
                <Text style={[MyStyles.padding, MyStyles.text]}>Giá: {course.price} VNĐ</Text>

                {user?.role === 3 && (
                    <Button mode="contained" loading={enrolling} onPress={() => navigation.navigate("Payment", { course: course })} style={{ marginTop: 15 }}>
                        Đăng kí ngay
                    </Button>
                )}


            </View>
        </>
    );
}

export default DetailCourse;