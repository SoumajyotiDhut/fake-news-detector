import axios from 'axios'

const BASE_URL = 'https://fake-news-detector-production-af52.up.railway.app'

const client = axios.create({ baseURL: BASE_URL })

export const predictText = (text) => client.post('/predict', { text })
export const explainText = (text) => client.post('/explain', { text })
export const predictRealtime = (text) => client.post('/predict-realtime', { text })
export const predictURL = (url) => client.post('/predict-url', { url })
export const getHistory = (limit = 20) => client.get(`/history?limit=${limit}`)
export const getHealth = () => client.get('/health')// deployed
