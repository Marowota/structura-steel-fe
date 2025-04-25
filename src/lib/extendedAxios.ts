import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { EToastType, toastNotification } from "./toastNotification";

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

  public async put<T, DTO>(
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
    console.log(error);
    switch (error.status) {
      case 401:
        toastNotification(
          "Unauthorized, please login again",
          EToastType.WARNING,
        );
        return;
      case 403:
        toastNotification("Forbidden", EToastType.ERROR);
        return;
      case 404:
        toastNotification("Resource not found", EToastType.ERROR);
        return;
      case 500:
        toastNotification("Internal server error", EToastType.ERROR);
        return;
      default:
        toastNotification("Something went wrong", EToastType.ERROR);
        return Promise.reject(error);
    }
  }

  private async setupInterceptors() {
    this.instance.interceptors.response.use(
      this.successInterceptor,
      this.errorInterceptor,
    );
  }
}

export const extendedAxios = Object.freeze(new ExtendedAxios());
