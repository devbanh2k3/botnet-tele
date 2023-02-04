import axios from '../axios'

const handleLoginApi = (email, password) => {
    return axios.post('api/login', { email, password });
}
const getDataAccount = (currentPage, limit) => {
    return axios.get(`/records/${currentPage}/${limit}`, {

    })
}
const getDataAccountKey = (currentPage, limit, key) => {
    return axios.get(`/records-update/${currentPage}/${limit}/${key}`, {

    })
}

export {
    getDataAccountKey,
    handleLoginApi,
    getDataAccount
};