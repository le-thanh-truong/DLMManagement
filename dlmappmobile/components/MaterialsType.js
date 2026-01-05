import { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import MyStyles from "../styles/MyStyles";
import { Chip } from "react-native-paper";

const MarterialsType =({setMaterialType}) => {
    const [type, setType] = useState([]);
    const materialsType = [{
        value: null,
        label: 'Tất cả',
        icon: 'apps' 
    },{ 
        value: 1, 
        label: 'Giáo trình', 
        icon: 'book' 
    },{ 
        value: 2, 
        label: 'Slide', 
        icon: 'presentation' 
    },{ 
        value: 3, 
        label: 'Video', 
        icon: 'video' 
    },{ 
        value: 4, 
        label: 'Tham khảo', 
        icon: 'file-document' 
    },];

    return(
        <View style={MyStyles.row}>
            <ScrollView horizontal style={MyStyles.margin}>
                {/* <TouchableOpacity>  */}
                    {materialsType.map(item => (<Chip key={item.value} icon={item.icon} 
                                                      selected={type === item.value} 
                                                      onPress={() => setMaterialType(item.value)}
                                                    style={MyStyles.margin}>{item.label}</Chip>
                                    ))}
                 {/* </TouchableOpacity> */}
            </ScrollView>
        </View>
    );
}
export default MarterialsType;