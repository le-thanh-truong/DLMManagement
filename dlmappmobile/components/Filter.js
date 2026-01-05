import { View, Text } from "react-native";
import { Button, Chip, Modal, Portal } from "react-native-paper";
import MyStyles from "../styles/MyStyles";
import { useEffect, useState } from "react";
import Apis, { endpoints } from "../utils/Apis";

const MaterialFilter = ({ visible, onDismiss, lessonId, setLessonId, topicId,
                         setTopicId, level, setLevel, onReset, onApply }) => {
                            
    const [lessons, setLessons] = useState([]);
    const [topic, setTopic] = useState([]);

    useEffect(() => {
        Apis.get(endpoints.lessons).then(res => setLessons(res.data));
        Apis.get(endpoints.topics).then(res => setTopic(res.data));
    }, []);

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={MyStyles.portalContainer} >
                <Text style={MyStyles.title}>Bộ lọc</Text>

                <Text style={MyStyles.text}>Môn học</Text>
                <View style={MyStyles.row}>
                    {lessons.map(item => (
                        <Chip key={item.id} style={{ margin: 4 }} selected={lessonId === item.id} onPress={() => setLessonId(item.id)}
                        >{item.subject}</Chip> ))}
                </View>
                <Text style={MyStyles.text}>Chủ đề</Text>
                <View style={MyStyles.row}>
                    {topic.map(item => (
                        <Chip key={item.id} style={{ margin: 4 }} selected={topicId === item.id} onPress={() => setTopicId(item.id)}
                        >{item.name}</Chip> ))}
                </View>
                <Text style={MyStyles.text}>Độ khó</Text>
                <View style={MyStyles.row}>
                    {[
                        { label: "Cơ bản", value: 1 },
                        { label: "Trung cấp", value: 2 },
                        { label: "Nâng cao", value: 3 }
                    ].map(item => (
                        <Chip
                            key={item.value} style={{ margin: 4 }} selected={level === item.value} onPress={() => setLevel(item.value)}
                        >{item.label}</Chip> ))}
                </View>

                <View style={[MyStyles.row]}>
                    <Button onPress={onReset}>Đặt lại</Button>
                    <Button mode="contained" onPress={onApply}>Áp dụng</Button>
                </View>
            </Modal>
        </Portal>
    );
};

export default MaterialFilter;
