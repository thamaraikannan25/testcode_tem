import axios from 'axios'
import config from './config.json'

const apiClient = axios.create({ baseURL: config.baseURL })

const getGreeting = (name, greeting, excited) => {
  return apiClient.get('/greet', {
    params: { name, greeting, excited }
  })
}

const API = {
  getGreeting
}

export default API