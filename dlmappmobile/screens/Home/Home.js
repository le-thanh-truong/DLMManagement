import { View } from "react-native";
import Categories from "../../components/Categories";
import MyStyles from "../../styles/MyStyles";
import Courses from "../../components/Courses";
import { useState } from "react";


const Home = () => {
    const [cate, setCate] = useState()

    return(
        <View style={[MyStyles.container, MyStyles.padding]}>
            <Categories setCate={setCate}/>
            <Courses cate={cate} />
        </View>
    );
}
export default Home;