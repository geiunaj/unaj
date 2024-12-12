import api from "../../../../config/api";
import {AxiosRequestConfig} from "axios";

export interface UploadFileRequest {
    files?: File[];
}

export async function uploadFileAction(body: UploadFileRequest): Promise<any> {
    const config: AxiosRequestConfig = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }
    return await api.post("/api/upload", body, config);
}