import { View, Text, Alert } from "react-native";
import { Button, TextInput, ActivityIndicator } from "react-native-paper";
import { useState, useContext } from "react";
import MyStyles from "../../styles/MyStyles";
import Apis, { endpoints } from "../../utils/Apis";
import { MyDispatchContext } from "../../configs/MyUserContext";
import { useNavigation } from "@react-navigation/native";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useContext(MyDispatchContext);
    const navigation = useNavigation();

    const login = async () => {
        if (!username || !password) {
            Alert.alert("Lỗi", "Vui lòng nhập tên đăng nhập và mật khẩu!");
            return;
        }

        try {
            setLoading(true);
            let res = await Apis.post(endpoints['login'], {
                "username": username,
                "password": password
            });

            dispatch({
                "type": "login",
                "payload": res.data
            });

        } catch (ex) {
            console.error(ex);
            Alert.alert("Lỗi", "Tên đăng nhập hoặc mật khẩu không chính xác!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={[MyStyles.container, MyStyles.padding, {justifyContent: 'center'}]}>
            <Text style={[MyStyles.title, {textAlign: 'center', marginBottom: 20, fontSize: 30, color: 'blue'}]}>ĐĂNG NHẬP</Text>

            <TextInput 
                value={username} 
                onChangeText={setUsername} 
                label="Tên đăng nhập" 
                style={MyStyles.marginBottom} 
                mode="outlined"
            />
            
            <TextInput 
                value={password} 
                onChangeText={setPassword} 
                label="Mật khẩu" 
                secureTextEntry 
                style={MyStyles.marginBottom} 
                right={<TextInput.Icon icon="eye" />} 
                mode="outlined"
            />

            {loading ? <ActivityIndicator size="large" color="blue" /> : <>
                <Button mode="contained" onPress={login} style={MyStyles.marginBottom}>
                    Đăng nhập
                </Button>
                <Button onPress={() => navigation.navigate("Register")}>
                    Đăng ký
                </Button>
            </>}
        </View>
    );
}

export default Login;