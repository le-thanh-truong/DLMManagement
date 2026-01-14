import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, TouchableOpacity, View } from "react-native";
import MyStyles from "../styles/MyStyles";
import Apis, { endpoints } from "../utils/Apis";
import { List, Searchbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";

const Courses = ({ cate }) => {
    const navigation = useNavigation();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);

    const loadCourses = async () => {
        try {
            setLoading(true)

            let url = `${endpoints['courses']}?page=${page}`;
            if (q) {
                url = `${url}&q=${q}`
            }

            if (cate) {
                url = `${url}&category=${cate}`
            }

            console.info(url);

            let res = await Apis.get(url);
            setCourses(res.data)
            // if(res.data.next === null)
            //     setPage(0);

            // if(page === 1){
            //     setCourses(res.data)
            // }
            // else if( page > 1){
            //     setCourses([...courses, ...res.data])
            // }

        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let timer = setTimeout(() => {
            if (page > 0)
                loadCourses();
        }, 500);

        return () => clearTimeout(timer);
    }, [q, page, cate]);

    useEffect(() => {
        setPage(1);
    }, [q, cate])

    const loadMore = () => {
        if (page > 0 && !loading)
            setPage(page + 1);
    }

    return (
        <>
            <Searchbar placeholder="Tìm khóa học..." style={MyStyles.margin} value={q} onChangeText={setQ} />
            <FlatList ListFooterComponent={loading && <ActivityIndicator size="large" />} data={courses} onEndReached={loadMore} 
                      renderItem={({ item }) => <List.Item
                                                title={item.subject}
                                                description={moment(item.created_date).format("DD/MM/YYYY")}
                                                left={() => <TouchableOpacity onPress={() => { navigation.navigate("Course Detail", { courseId: item.id }) }} >
                                                    <Image source={item.image ? { uri: item.image } : require('../assets/images/memecat2.jpg')} style={MyStyles.avatar} />
                                                </TouchableOpacity>} />
            } />
        </>
    );
}

export default Courses;