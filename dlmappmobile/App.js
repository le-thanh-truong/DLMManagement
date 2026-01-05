import Home from "./screens/Home/Home";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import DetailCourse from "./screens/Home/DetailCourse";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Discuss from "./screens/Discuss/Discuss"
import My from "./screens/User/My"
import Login from "./screens/User/Login";
import { Icon, PaperProvider } from "react-native-paper";
import PageMaterials from "./screens/Material/PageMaterials";
import StudentProgess from "./screens/Study/StudentProgess";
import MaterialDetail from "./screens/Material/MaterialDetail";
import MyUserReducer from "./reducers/MyUserReducer";
import { MyDispatchContext, MyUserContext } from "./configs/MyUserContext";
import { useReducer } from "react";


const Stack = createNativeStackNavigator();
const StackNavigator = () => {
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Course" component={Home} options={{title: "Khóa học"}}/>
            <Stack.Screen name="Course Detail" component={DetailCourse} options={{title: "Chi tiết khóa học"}}/>
        </Stack.Navigator>
    );
}

const StackMaterials = () => {
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Marterials" component={PageMaterials} options={{title: "Tài liệu"}}/>
            <Stack.Screen name="Material detail" component={MaterialDetail} options={{title: "Chi tiết tài liệu"}}/>
        </Stack.Navigator>
    );
}

const AuthStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login}/>
        </Stack.Navigator>
    );
}

const Tab = createBottomTabNavigator();
const TabNavigator = () => {
     return(
        <Tab.Navigator screenOptions={{tabBarActiveTintColor: "blue" ,tabBarInactiveTintColor: "gray"}}>
            <Tab.Screen name="Home" component={StackNavigator} options={{title:"Home", tabBarIcon: ({color}) => <Icon source="home" size={25} color={color} />}}/>
            <Tab.Screen name="Marterials" component={StackMaterials} options={{title:"Tài liệu", tabBarIcon: ({color}) => <Icon source="file-document" size={25} color={color}/>}}/>
            <Tab.Screen name="Study" component={StudentProgess} options={{title:"Tiến trình cá nhân", tabBarIcon: ({color}) => <Icon source="layers-edit" size={25} color={color}/>}}/>
            <Tab.Screen name="Discuss" component={Discuss} options={{title:"Thảo luận", headerShown: false, tabBarIcon: ({color}) => <Icon source="clouds" size={25} color={color}/>}}/>
            <Tab.Screen name="My" component={My} options={{title: "Tôi", tabBarIcon: ({color}) => <Icon source="account" size={25} color={color}/>}} />
        </Tab.Navigator>
     );
}

const App = () => {
    const [user, dispatch] = useReducer(MyUserReducer, null);

    return(
       <PaperProvider>
            <MyUserContext.Provider value={user}>
                <MyDispatchContext.Provider value={dispatch}>
                    <NavigationContainer>
                        {user === null ? <AuthStackNavigator /> : <TabNavigator />}
                    </NavigationContainer>
                </MyDispatchContext.Provider>
            </MyUserContext.Provider>
                    {/* <NavigationContainer>
                        <TabNavigator />
                    </NavigationContainer> */}
        </PaperProvider>
    );
}

export default App;