import axios from "axios";
import { removeTokens, saveTokens, getRefreshToken } from "../utils/Auth";
import Swal from "sweetalert2";

interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const resetAxios = () => {
  delete axios.defaults.headers.common['Authorization'];
};

const redirectToLogin = () => {
  removeTokens();
  resetAxios();
  Swal.fire({
    icon: "warning",
    title: "Sesión expirada",
    text: "Tu sesión ha expirado debido a un error de sistema.",
    confirmButtonText: "Aceptar",
  }).then(() => {
    window.location.href = "/login";
  });
};

axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry &&
      error.response.data !== "Credenciales inválidas."
    ) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;
      }

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axios(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token");

        const refreshResponse = await axios.post<RefreshTokenResponse>(`${axios.defaults.baseURL}/auth/refresh`, { refreshToken });
        const { token, refreshToken: newRefreshToken } = refreshResponse.data;
        saveTokens(token, newRefreshToken);
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        processQueue(null, token);
        originalRequest.headers['Authorization'] = 'Bearer ' + token;
        return axios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        redirectToLogin();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

axios.defaults.baseURL = 'http://localhost:9999/api';

export default axios;
export { redirectToLogin, resetAxios };