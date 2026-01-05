import MyStyles from "../../styles/MyStyles";
import Chat from "./Chat";
import Forum from "./Forum";
import Quiz from "./Quiz";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ChatDetail from "./ChatDetail";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Lessons from "./Lessons";
import AddQuestion from "./AddQuestion";


const Tab = createMaterialTopTabNavigator()

const Stack = createNativeStackNavigator();
const StackChat =() =>{
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Chat" component={Chat} options={{title: "Chat"}}/>
            <Stack.Screen name="ChatDetail" component={ChatDetail}/>
        </Stack.Navigator>
    );
}

const StackQuestions =() =>{
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Lesson" component={Lessons} options={{title: "Bài học"}}/>
            <Stack.Screen name="Forum" component={Forum} options={{title: "Diễn đàn bài học"}}/>
            <Stack.Screen name="Add question" component={AddQuestion}/>
        </Stack.Navigator>
    );
}

const Discuss = () => {
        return(
            <Tab.Navigator style={[MyStyles.marginTop, MyStyles.margin]}>
                <Tab.Screen name="Chat" component={StackChat} options={{title: "Chat"}}/>
                <Tab.Screen name="Lesson" component={StackQuestions} options={{title: "Bài học"}}/>
                <Tab.Screen name="Quiz" component={Quiz} options={{title: "Quiz"}}/>
            </Tab.Navigator>
        );
}

export default Discuss;