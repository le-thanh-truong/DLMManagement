import { View, Text } from "react-native";
import { Button, Avatar } from "react-native-paper";
import { useContext } from "react";
import { MyUserContext, MyDispatchContext } from "../../configs/MyUserContext";
import MyStyles from "../../styles/MyStyles";

const My = () => {
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);

    const logout = () => {
        dispatch({
            "type": "logout"
        })
    }

    return (
        <View style={[MyStyles.container, MyStyles.padding, { alignItems: 'center' }]}>
            <Avatar.Image 
                size={100} 
                source={user?.avatar ? { uri: user.avatar } : require('../../assets/images/memecat2.jpg')} 
                style={{marginBottom: 20}}
            />
            
            <Text style={[MyStyles.title, {marginBottom: 30}]}>
                Xin chào, {user?.last_name} {user?.first_name}!
            </Text>

            <Button icon="logout" mode="contained" onPress={logout} buttonColor="red">
                Đăng xuất
            </Button>
        </View>
    );
}

export default My;