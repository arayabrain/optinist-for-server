import axiosLibrary from 'axios'
import { refreshTokenApi } from 'api/auth/Auth'
import { BASE_URL } from 'const/API'
import { getExToken, getToken, logout, saveToken } from 'utils/auth/AuthUtils'

const axios = axiosLibrary.create({
  baseURL: BASE_URL,
  timeout: 600000,
})

axios.interceptors.request.use(
  async (config) => {
    config.headers.Authorization = `Bearer ${getToken()}`
    config.headers.ExToken = getExToken()
    return config
  },
  (error) => Promise.reject(error),
)

axios.interceptors.response.use(
  async (res) => res,
  async (error) => {
    if (error?.response?.status === 401) {
      try {
        const { access_token } = await refreshTokenApi()
        saveToken(access_token)
        error.config.headers.Authorization = `Bearer ${access_token}`
        return axiosLibrary(error.config)
      } catch (e: any) {
        if (e?.response?.status === 400) {
          logout()
        }
        throw e
      }
    }
    return Promise.reject(error)
  },
)

export default axios
