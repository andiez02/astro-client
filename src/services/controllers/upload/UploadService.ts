import { AxiosInstance } from "axios";

class UploadService {
    constructor(private apiClient: AxiosInstance) {}

    async uploadFile(file: File, onProgress?: (percent: number) => void) {
    const formData = new FormData();
    formData.append('file', file);

    return this.apiClient.post('/upload/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (event) => {
        if (!event.total || !onProgress) return;
        const percent = Math.round((event.loaded * 100) / event.total);
        onProgress(percent);
      },
    });
}
}

export default UploadService