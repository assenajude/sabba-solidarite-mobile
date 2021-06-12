import {create} from 'apisauce'
import setting from "./setting";

const apiClient = create({
    baseURL: setting.baseURL
})

export default apiClient