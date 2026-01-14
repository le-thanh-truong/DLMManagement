import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";
import Apis, { authApi, endpoints } from "../utils/Apis";
import { Button, Chip, List, Searchbar } from "react-native-paper";
import MyStyles from "../styles/MyStyles";
import { FlatList } from "react-native";
import MaterialFilter from "./Filter";
import { useNavigation } from "@react-navigation/native";
import { MyUserContext } from "../configs/MyUserContext";

const Materials = ({materialType}) =>{
    const [material, setMaterial] = useState([]);
    const [lessonId, setLessonId] = useState(null);
    const [topicId, setTopicId] = useState(null);
    const [level, setLevel] = useState(null);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);
    const navigation = useNavigation();

    const MaterialsType = {
                            1: 'Giáo trình',
                            2: 'Slide',
                            3: 'Video',
                            4: 'Tài liệu tham khảo'
                        };

    const getMaterialType = (type) => {
        return MaterialsType[type] || 'Slide';  
    };

    const user = useContext(MyUserContext);

    const loadMaterial = async () => {
        try{
            setLoading(true)

            let url = `${endpoints['materials']}?page=${page}`;
            if (q) {
                url = `${url}&q=${q}`
            }
            if (materialType){
                url = `${url}&material_type=${materialType}`
            }
            if (lessonId){
                url = `${url}&lesson=${lessonId}`
            }
            if (topicId){
                url = `${url}&topic=${topicId}`
            }
            if (level){
                url = `${url}&level=${level}`
            }
            
            console.info(url);
            
            let res;
            if (user && user.token) {
                res = await authApi(user.token).get(url);
            } else {
                res = await Apis.get(url);
            }
            setMaterial(res.data)
                    
            } catch (ex) {
                console.error(ex);
            } finally{
                setLoading(false);
            }
        }

    const resetFilter =() =>{
        setLessonId(null);
        setTopicId(null);
        setLevel(null);
        setPage(1);
        setVisible(false);
    }
    const applyFilter =() =>{
        setPage(1);
        setVisible(false);
    }
    
    useEffect(() => {
        let timer = setTimeout(() => {
            if (page > 0)
                loadMaterial();
        }, 500);

        return () => clearTimeout(timer);
    }, [q, page, materialType, lessonId, topicId, level]);

    useEffect(() => {
        setPage(1);
    }, [q, materialType, lessonId, topicId, level])
    
    const loadMore = () => {
        if (page > 0 && !loading)
            setPage(page + 1);
    }


    return(
        <>
            <Searchbar placeholder="Tìm tài liệu..." style={MyStyles.margin} value={q} onChangeText={setQ}/>
            <Button icon='filter' onPress={() => {setVisible(true)}} style={MyStyles.right} >Lọc</Button>
            <MaterialFilter
                visible={visible}
                onDismiss={() => setVisible(false)}
                lessonId={lessonId}
                setLessonId={setLessonId}
                topicId={topicId}
                setTopicId={setTopicId}
                level={level}
                setLevel={setLevel}
                onReset={resetFilter}
                onApply={applyFilter}
            />
            <FlatList ListFooterComponent={loading && <ActivityIndicator size="large" />} data={material} onEndReached={loadMore} 
                                  renderItem={({ item }) => <List.Item style={MyStyles.title}
                                                            title={item.name}
                                                            description={`Loại: ${getMaterialType(item.material_type)}`}
                                                             left={() => <TouchableOpacity onPress={()=> { navigation.navigate("Material detail", {material: item})}} >
                                                                                <Image source={item.file_upload ? { uri: item.file_upload } : require('../assets/images/word.png')} style={MyStyles.avatar} />
                                                                         </TouchableOpacity>} 
                                                            />} 
            />

        </>
    );
}
export default Materials;