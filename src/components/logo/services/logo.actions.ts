import api from "../../../../config/api";
import { AxiosRequestConfig } from "axios";

export interface UploadFileRequest {
  logo?: File;
  logoDark?: File;
  fondo?: File;
  fondoDark?: File;
}

export async function changeLogo(body: UploadFileRequest): Promise<any> {
  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  return await api.post("/api/logo", body, config);
}
