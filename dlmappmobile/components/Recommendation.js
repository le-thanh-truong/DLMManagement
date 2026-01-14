import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { useContext, useEffect, useState } from "react";
import Apis, { authApi, endpoints } from "../utils/Apis";
import { MyUserContext } from "../configs/MyUserContext";
import { useNavigation } from "@react-navigation/native";
import MyStyles from "../styles/MyStyles";

const Recommendations = () => {
    const navigation = useNavigation();
    const user = useContext(MyUserContext);
    const [courses, setCourses] = useState([]);

    const loadRecommendations = async () => {
        try {
            const res = await authApi(user.token).get(endpoints['recommendations']);
            setCourses(res.data);
        } catch (err) {
            console.error(err);
            setCourses([]);
        }
    };

    useEffect(() => {
        loadRecommendations();
    }, []);

    if (!courses.length) return null;

    return (
        <View style={{ marginVertical: 7 }}>
            <FlatList horizontal data={courses} keyExtractor={item => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity style={{ width: 200, margin: 8 }} onPress={() =>
                            navigation.navigate("Course Detail", { courseId: item.id })}>
                        <Image
                            source={{ uri: item.image }}
                            style={{ height: 90, borderRadius: 8, width: 150 }}
                        />
                        <Text numberOfLines={2} style={{ marginTop: 5 }}> {item.subject} </Text>
                        <Text style={{ color: "green" }}> {item.price} VNĐ </Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default Recommendations;
