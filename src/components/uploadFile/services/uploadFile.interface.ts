interface UploadFileResponse {
    id: string;
    name: string;
    fileId: string;
    mimeType?: string;
    downloadLink: string;
    streamLink: string;
}