import axios from "axios"

const BASE_URL = 'https://lethanhtruong.pythonanywhere.com/'

export const endpoints = {
    'categories': '/categories/',
    'lessons': '/lessons/',
    'courses': '/courses/',
    'materials': '/materials/',
    'learning-progress': '/learning-progress/',
    'topics': '/topics/',
    'users': '/users/',
    'login': '/login/',
    'current-user': '/users/current-user/',
    'comments': '/comments/',
    'questions': '/questions/',
    'answers': '/answers/',
    'likes': '/likes/',
    'notes': '/notes/',
    'exams': '/exams/',
    'submitExam': (id) => `/exams/${id}/submit/`,
    'orders': '/orders/',
    'stats/student-stats': '/stats/student-stats/',
    'stats/admin-stats': '/stats/admin-stats/',
    'enrollments': "/enrollments/",
    'recommendations': '/recommendations/',
    'chatRooms' : '/chat-rooms/',
    'chatRoomMessages': (roomId) =>`/chat-rooms/${roomId}/messages/`,
    'messages': "/messages/",
}

export const authApi = (accessToken) => axios.create({
    baseURL: BASE_URL,
    headers: {
        "Authorization": `Token ${accessToken}`
    }
});

export default axios.create({
    baseURL: BASE_URL
});