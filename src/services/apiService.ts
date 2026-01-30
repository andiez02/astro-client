import apiClient from './apiClient'
import AuthService from './controllers/auth/AuthService'
import CollectionService from './controllers/collection/CollectionService'
import UploadService from './controllers/upload/UploadService'

export class ApiService {
    public auth: AuthService
    public collection: CollectionService
    public upload: UploadService
    
    constructor() {
        this.auth = new AuthService(apiClient)
        this.collection = new CollectionService(apiClient)
        this.upload = new UploadService(apiClient)
    }
}

export const api = new ApiService()
