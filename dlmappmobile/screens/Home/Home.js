import { View } from "react-native";
import Categories from "../../components/Categories";
import MyStyles from "../../styles/MyStyles";
import Courses from "../../components/Courses";
import { useState } from "react";
import Recommendations from "../../components/Recommendation";
import { useNavigation } from "@react-navigation/native";


const Home = () => {
    const [cate, setCate] = useState()
    const navigation =useNavigation();

    return(
        <View style={[MyStyles.container, MyStyles.padding]}>
            <Categories setCate={setCate}/>
            <Recommendations navigation={navigation} />
            <Courses cate={cate} />
        </View>
    );
}
export default Home;