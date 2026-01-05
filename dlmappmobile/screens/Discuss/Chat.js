import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { Searchbar } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";
import { useEffect, useState, useContext } from "react";
import Apis, { endpoints, authApi } from "../../utils/Apis";
import { useNavigation } from "@react-navigation/native";
import { MyUserContext } from "../../configs/MyUserContext";

const Chat = () => {
    const navigation = useNavigation();
    const [chat, setChat] = useState([]);
    const [loading, setLoading] = useState(false);
    const [q, setQ] = useState("");

    const currentUser = useContext(MyUserContext);

    const loadChat = async() =>{
        if (!currentUser || !currentUser.token) return;
        
        try {
            setLoading(true)
        
            const res = await authApi(currentUser.token).get(endpoints["users"], {
                params: {
                    q: q
                } 
            });

            let usersData = res.data.results || res.data;

            setChat(usersData.filter(u => u.id !== currentUser.user_id));
            
            } catch (ex) {
                console.error(ex);
            } finally {
                 setLoading(false);
            }
    }

    useEffect(() => {
            if (currentUser) {
            let timer = setTimeout(() => {
                loadChat();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [q, currentUser]);

    if (!currentUser) {
        return (
            <View style={[MyStyles.container, MyStyles.padding, {justifyContent: 'center', alignItems: 'center'}]}>
                <Text>Vui lòng đăng nhập để sử dụng tính năng Chat.</Text>
            </View>
        )
    }

     return(
        <View style={MyStyles.container}>
            <Searchbar 
                placeholder="Tìm kiếm người dùng..." 
                style={[MyStyles.margin, MyStyles.marginBottom]} 
                value={q} 
                onChangeText={setQ}
            />
            
            {loading && <ActivityIndicator size="large" color="blue" />}
            
            <FlatList 
                data={chat} 
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        onPress={() => navigation.navigate("ChatDetail", { user: item })} 
                        style={[MyStyles.row, MyStyles.padding, { alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee' }]}
                    >
                        {/* Avatar */}
                        <Image 
                            source={item.avatar ? { uri: item.avatar } : require('../../assets/images/memecat2.jpg')} 
                            style={{ width: 60, height: 60, borderRadius: 30, marginRight: 15 }} 
                        />
                        
                        {/* Thông tin User */}
                        <View style={{ flex: 1 }}>
                            <Text style={[MyStyles.title, { fontSize: 16 }]}>
                                {item.last_name + " " + item.first_name}
                            </Text>
                            <Text style={{ color: "#666", marginTop: 4, fontStyle: 'italic' }}>
                                Nhấn để bắt đầu trò chuyện...
                            </Text>
                        </View>
                    </TouchableOpacity>
                )} 
            />
        </View>
    );
}

export default Chat;