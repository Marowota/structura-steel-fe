import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { EToastType, toastNotification } from "./toastNotification";
import { API_URL } from "@/constant/apiURL";
import { store } from "@/lib/store";
import { authSlice } from "./reducers";

class ExtendedAxios {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create();
    this.setupInterceptors();
  }

  public async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }

  public async post<T, DTO = unknown>(
    url: string,
    data?: DTO,
    config?: AxiosRequestConfig<DTO>,
  ): Promise<AxiosResponse<T, DTO>> {
    return this.instance.post<T, AxiosResponse<T, DTO>, DTO>(url, data, config);
  }

  public async put<T, DTO = unknown>(
    url: string,
    data?: DTO,
    config?: AxiosRequestConfig<DTO>,
  ): Promise<AxiosResponse<T, DTO>> {
    return this.instance.put<T, AxiosResponse<T, DTO>, DTO>(url, data, config);
  }

  public async patch<T, DTO>(
    url: string,
    data?: DTO,
    config?: AxiosRequestConfig<DTO>,
  ): Promise<AxiosResponse<T, DTO>> {
    return this.instance.patch<T, AxiosResponse<T, DTO>, DTO>(
      url,
      data,
      config,
    );
  }

  public async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config);
  }

  private async successInterceptor<T, DTO>(response: AxiosResponse<T, DTO>) {
    return response;
  }

  private async errorInterceptor<T, DTO>(error: AxiosError<T, DTO>) {
    switch (error.response?.status) {
      case 400:
        if (error.config?.url?.includes(API_URL.AuthService.login)) {
          store.dispatch(
            authSlice.actions.setFirstLogin({
              firstLogin: true,
            }),
          );
          toastNotification("Please change your password", EToastType.INFO);
          return;
        }
        return Promise.reject(error);
      case 401:
        if (error.config?.url?.includes(API_URL.AuthService.login)) {
          return Promise.reject(error);
        }
        store.dispatch(authSlice.actions.expireToken());
        return;
      case 403:
        return Promise.reject({
          message:
            "You don't have permission to do this, please contact your admin",
        });
      case 404:
        toastNotification("Resource not found", EToastType.ERROR);
        return Promise.reject(error);
      case 409:
        return Promise.reject(error);
      case 500:
        if (error.config?.url?.includes(API_URL.userService.signUp)) {
          return Promise.reject(error);
        }
        toastNotification("Internal server error", EToastType.ERROR);
        return;
      default:
        toastNotification("Backend not available", EToastType.ERROR);
        return Promise.reject(error);
    }
  }

  private async setupInterceptors() {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const accessToken = sessionStorage.getItem("access_token");

        if (accessToken && config.url !== API_URL.AuthService.login) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        return {
          ...config,
        };
      },
    );

    this.instance.interceptors.response.use(
      this.successInterceptor,
      this.errorInterceptor,
    );
  }
}

export const extendedAxios = Object.freeze(new ExtendedAxios());

export const axiosRequestHandler = async <T, DTO>(
  axiosRequest: () => Promise<AxiosResponse<T, DTO>>,
): Promise<AxiosResponse<T, DTO>> => {
  try {
    const response = await axiosRequest();
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};
