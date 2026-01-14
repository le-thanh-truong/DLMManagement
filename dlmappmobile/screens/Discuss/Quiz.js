import { Text, FlatList, View, Alert } from "react-native";
import { useContext, useEffect, useState } from "react";
import { Card, RadioButton, Button, ProgressBar } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";
import Apis, { authApi, endpoints } from "../../utils/Apis";
import { MyUserContext } from "../../configs/MyUserContext";

const Quiz = ({ route }) => {
    const lessonId = route.params?.lessonId;
    const [exam, setExam] = useState(null);
    const [answers, setAnswers] = useState({});
    const user = useContext(MyUserContext);
    const [timeLeft, setTimeLeft] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const loadExam = async () => {
        try {
            let url = `${endpoints.exams}?lesson=${lessonId}`;
            let res;
            if (user && user.token) {
                res = await authApi(user.token).get(url);
            } else {
                res = await Apis.get(url);
            }

            const data = res.data.results ?? res.data;
            const examData = data[0];

            setExam(examData);
            setTimeLeft(examData.duration * 60);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (timeLeft === null || isSubmitted) return;

        if (timeLeft <= 0) {
            setIsSubmitted(true);
            Alert.alert("Hết giờ", "Bài kiểm tra đã được nộp");
            submitExam();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    const selectAnswer = (questionId, choiceId) => {
        setAnswers({ ...answers, [questionId]: choiceId });
    };

    const submitExam = async () => {
        try {
            const res = await authApi(user.token).post(
                endpoints.submitExam(exam.id),
                { answers }
            );

            if (res?.data) {
                Alert.alert(
                    "Kết quả",
                    `Điểm: ${res.data.score}\n${res.data.message}`
                );
            }
        } catch (ex) {
            console.error(ex);

            Alert.alert("Lỗi", "Không thể nộp bài.");
        }
    };


    useEffect(() => {
        loadExam();
    }, []);

    if (!exam) {
        return (
            <View style={MyStyles.padding}>
                <Text>Đang tải bài kiểm tra...</Text>
            </View>
        );
    }

    return (
        <FlatList style={MyStyles.padding} data={exam.questions} keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={
                <>
                    <Card style={{ marginBottom: 16 }}>
                        <Card.Title
                            title={exam.title}
                            subtitle={`Thời gian: ${exam.duration} phút`}
                        />
                        <Card.Content>
                            <Text>{exam.description}</Text>
                            <Text>Điểm đạt: {exam.pass_score}</Text>
                            <Text style={{ fontWeight: "bold", marginTop: 8 }}>
                                Thời gian còn lại: {formatTime(timeLeft)}
                            </Text>
                            <ProgressBar
                                progress={timeLeft / (exam.duration * 60)}
                                style={{ marginTop: 8, height: 8 }}
                            />
                        </Card.Content>
                    </Card>
                </>
            }
            renderItem={({ item, index }) => (
                <Card style={{ marginBottom: 12 }}>
                    <Card.Content>
                        <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
                            Câu {index + 1}: {item.content}
                        </Text>

                        <RadioButton.Group
                            onValueChange={(value) => selectAnswer(item.id, value)}
                            value={answers[item.id]}
                        >
                            {item.choices.map((c) => (
                                <View key={c.id} style={{ flexDirection: "row", alignItems: "center" }}>
                                    <RadioButton value={c.id} />
                                    <Text>{c.content}</Text>
                                </View>
                            ))}
                        </RadioButton.Group>
                    </Card.Content>
                </Card>
            )}
            ListFooterComponent={
                <Button mode="contained" onPress={submitExam} style={{ marginVertical: 24 }}
                    disabled={
                        Object.keys(answers).length < exam.question_count
                    }
                > Nộp bài
                </Button>
            }
        />
    );
};

export default Quiz;
