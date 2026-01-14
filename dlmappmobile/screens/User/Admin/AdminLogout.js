import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { useContext } from "react";
import { MyDispatchContext } from "../../../configs/MyUserContext";

const AdminLogout = () => {
    const dispatch = useContext(MyDispatchContext);

    const logout = () => {
        dispatch({
            type: "logout"
        });
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Button icon="logout" mode="contained" onPress={logout}>
                Đăng xuất
            </Button>
        </View>
    );
};

export default AdminLogout;
