import api from "../../common/interface";

export const getImageFind = name => api.get(`/image/find?name=${name}`, {})

export const getOnload = () => api.get(`/onload`, {

})

export const getVideoSerach = params => api.post(`/video/serach`,
    params
)