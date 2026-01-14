import { View, Text, FlatList, TextInput, Image } from "react-native";
import { IconButton } from "react-native-paper";
import { useState } from "react";
import MyStyles from "../../styles/MyStyles";

const messagesEx = [
    { id: 1, text: "Chào!", sender: "teacher" },
    { id: 2, text: "Hi!", sender: "me" },
    { id: 3, text: "Ăn cơm chưa", sender: "teacher" },
];

const ChatDetail = ({ route, navigation }) => {
    const {user} = route.params;
    const [messages, setMessages] = useState(messagesEx);
    const [text, setText] = useState("");

    const sendMessage = () => {
        if (!text.trim()) return;

        setMessages([...messages, { id: Date.now(), text, sender: "me" }]);
        setText("");
    };

    const renderItem = ({ item }) => {
        const isMe = item.sender === "me";

        return (
            <View
                style={[MyStyles.row, {justifyContent: isMe ? "flex-end" : "flex-start"}]}>

                {!isMe && (
                    <Image source={require("../../assets/images/memecat2.jpg")}
                        style={{ width: 50, height: 50, borderRadius: 25, marginRight: 6 }} />
                )}

                <View style={{ backgroundColor: isMe ? "#5c4fbeff" : "#e5e5e5",  padding: 10, borderRadius: 12}}>

                    <Text style={{ color: isMe ? "white" : "black" }}>
                        {item.text}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View style={ MyStyles.container}>
            <View
                style={[MyStyles.row ,{ backgroundColor: "#f3eeeeff"}]}>
                <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
                <Image
                    source={require("../../assets/images/memecat2.jpg")}
                    style={{ width: 36, height: 36, borderRadius: 18 }}/>
                <Text style={[MyStyles.padding, MyStyles.title]}>
                    {user.last_name +" " +user.first_name}
                </Text>
            </View>

            <FlatList data={messages} key={(item) => item.id.toString()} renderItem={renderItem}
                contentContainerStyle={MyStyles.padding}/>

            <View style={[MyStyles.row, { backgroundColor: "#cfc1c1ff"}]}>
                <IconButton icon="emoticon-outline" />
                <TextInput
                    placeholder="Nhập tin nhắn..." value={text} onChangeText={setText}
                    style={[{flex: 1,backgroundColor: "#f1f1f1"}, MyStyles.margin]}/>
                <IconButton icon="send" onPress={sendMessage} />
            </View>
        </View>
    );
};

export default ChatDetail;