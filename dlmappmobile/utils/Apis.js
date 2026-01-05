import axios from "axios"

const BASE_URL = 'https://lethanhtruong.pythonanywhere.com/'

export const endpoints = {
    'categories': '/categories/',
    'lessons': '/lessons/',
    'courses': '/courses/',
    'materials': '/materials/',
    'topics': '/topics/',
    'users': '/users/',
    'login': '/login/',
    'current-user': '/users/current-user/',
    'comments': '/comments/',
    'questions': '/questions/',
    'answers': '/answers/',
    'likes': '/likes/',
    'notes': '/notes/',
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