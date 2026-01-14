import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { MyUserContext } from '../../configs/MyUserContext';
import MyStyles from '../../styles/MyStyles';
import { Button } from 'react-native-paper';
import { authApi, endpoints } from '../../utils/Apis';

const Payment = ({ route, navigation }) => {
    const { course } = route.params;
    const contextData = useContext(MyUserContext);
    const user = useContext(MyUserContext);

    console.log("USER DATA:", user);

    const BANK_ID = "MB";
    const ACCOUNT_NO = "68686811112005";
    const ACCOUNT_NAME = "TRAN ANH TU";
    const TEMPLATE = "compact";

    const removeDiacritics = (str) => {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D")
            .toUpperCase();
    };

    const transferContent = `${user?.username} - ${removeDiacritics(course.subject)}`;

    const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.png?amount=${course.price}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

    const enrollCourse = async () => {
        try {
            const api = authApi(user.token);

            await api.post(endpoints.enrollments, {
                course: course.id
            });

            Alert.alert(
                "Thành công",
                "Đăng ký khóa học thành công!",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.navigate("Home")
                    }
                ]
            );
        } catch (err) {
            console.log("ENROLL ERROR:", err.response?.data);
            Alert.alert("Lỗi", "Không thể đăng ký khóa học");
        }
    };

    const handleConfirm = () => {
        Alert.alert(
            "Xác nhận",
            "Bạn đã thực hiện chuyển khoản chưa?",
            [
                { text: "Chưa", style: "cancel" },
                {
                    text: "Đã chuyển",
                    onPress: enrollCourse
                }
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>THÔNG TIN THANH TOÁN</Text>

                <View style={styles.qrContainer}>
                    <Image
                        source={{ uri: qrUrl }}
                        style={styles.qrImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.scanHint}>Quét mã QR để thanh toán</Text>
                </View>

                <View style={styles.infoContainer}>
                    <InfoRow label="Ngân hàng" value={BANK_ID} />
                    <InfoRow label="Chủ tài khoản" value={ACCOUNT_NAME} />
                    <InfoRow label="Số tài khoản" value={ACCOUNT_NO} isCopy={true} />
                    <View style={styles.divider} />
                    <InfoRow label="Khóa học" value={course.subject} />
                    <InfoRow label="Học phí" value={`${course.price.toLocaleString()} VNĐ`} highlight={true} />
                    <View style={styles.divider} />
                    <Text style={styles.contentLabel}>Nội dung chuyển khoản (Bắt buộc):</Text>
                    <View style={styles.contentBox}>
                        <Text style={styles.contentText}>{transferContent}</Text>
                    </View>
                </View>

                <Button mode="contained" onPress={handleConfirm} buttonColor="#055a8bff" textColor="white"
                    style={{ marginTop: 20, paddingVertical: 6, borderRadius: 8 }}
                    labelStyle={{ fontSize: 16, fontWeight: "bold" }}>
                    XÁC NHẬN ĐÃ CHUYỂN KHOẢN
                </Button>
            </View>
        </ScrollView>
    );
};

const InfoRow = ({ label, value, highlight, isCopy }) => (
    <View style={styles.row}>
        <Text style={styles.label}>{label}:</Text>
        <Text style={[styles.value, highlight && styles.highlight]}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 15,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        marginBottom: 20,
        textTransform: 'uppercase'
    },
    qrContainer: {
        alignItems: 'center',
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
    },
    qrImage: {
        width: 250,
        height: 250,
    },
    scanHint: {
        marginTop: 10,
        color: '#888',
        fontSize: 12,
        fontStyle: 'italic'
    },
    infoContainer: {
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        alignItems: 'center'
    },
    label: {
        color: '#666',
        fontSize: 14,
    },
    value: {
        fontWeight: '600',
        fontSize: 15,
        color: '#333',
        flex: 1,
        textAlign: 'right',
        marginLeft: 10,
    },
    highlight: {
        color: '#d32f2f',
        fontSize: 18,
        fontWeight: 'bold'
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 10,
    },
    contentLabel: {
        color: '#666',
        marginBottom: 5,
        fontSize: 14,
    },
    contentBox: {
        backgroundColor: '#e3f2fd',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#90caf9',
        alignItems: 'center',
    },
    contentText: {
        color: '#1565c0',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

export default Payment;