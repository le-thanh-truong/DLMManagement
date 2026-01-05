import { View } from "react-native";
import MyStyles from "../../styles/MyStyles";
import MarterialsType from "../../components/MaterialsType";
import Materials from "../../components/Materials";
import Courses from "../../components/Courses";
import { useState } from "react";

const PageMaterials =() => {
    const [materialType, setMaterialType] = useState();

    return(
        <View style={[MyStyles.padding, MyStyles.container]}>
            <MarterialsType setMaterialType={setMaterialType}/>
            <Materials materialType={materialType}/>
        </View>
    );
}
export default PageMaterials;