import { useEffect, useState } from "react";
import { List, Searchbar } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";
import Apis, { endpoints } from "../../utils/Apis";
import { FlatList } from "react-native";
import { ActivityIndicator } from "react-native";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Lessons = () => {
    const navigation = useNavigation();
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);

    const loadLessons = async () => {
        try {
            setLoading(true)

            let url = `${endpoints['lessons']}?page=${page}`;
            if (q) {
                url = `${url}&q=${q}`
            }


            console.info(url);

            let res = await Apis.get(url);
            setLessons(res.data)
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
                loadLessons();
        }, 500);

        return () => clearTimeout(timer);
    }, [q, page]);

    useEffect(() => {
        setPage(1);
    }, [q])

    const loadMore = () => {
        if (page > 0 && !loading)
            setPage(page + 1);
    }

    return (
        <>
        <Searchbar placeholder="Tìm kiếm..." style={MyStyles.margin}/>
        <FlatList ListFooterComponent={loading && <ActivityIndicator size="large" />} data={lessons} onEndReached={loadMore} 
                      renderItem={({ item }) => (<TouchableOpacity onPress={() => { navigation.navigate("Forum", {lessonId: item.id}  )}}>
                                                <List.Item
                                                title={item.subject}
                                                description={item.created_date}
                                                />
                                                </TouchableOpacity>)
            } />
        </>
    );

}
export default Lessons;