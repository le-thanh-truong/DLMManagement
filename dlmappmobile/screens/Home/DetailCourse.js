import { useEffect, useState } from "react";
import Apis, { endpoints } from "../../utils/Apis";
import { Image, Text, View } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { ActivityIndicator } from "react-native";


const DetailCourse = ({route}) => {
    const [course, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const courseId = route.params?.courseId

    const loadDetail = async () => {
        try{
            setLoading(true)
        
            let res = await Apis.get(`${endpoints['courses']}${courseId}/`);

            setCourses(res.data)
                
            } catch (ex) {
                console.error(ex);
            } finally{
                setLoading(false);
        }
    }

    useEffect(() =>{
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

    return(
        <View style={MyStyles.header}>
            <Image source={course.image ? { uri: course.image } : require('../../assets/images/memecat2.jpg')}style={[MyStyles.avatar]} />
            <View style={MyStyles.textContainer}> 
                <Text style={ MyStyles.title}>{course.subject}</Text>
                <View style={MyStyles.row}> 
                    <Text style={[MyStyles.context, MyStyles.textContainer]}>Khóa học số: </Text>
                    <Text style={[MyStyles.context, MyStyles.textContainer]}>Bài học: </Text>
                </View>
            </View>
        </View>
    );
}

export default DetailCourse;