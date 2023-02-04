import ApiService from '../services/ApiService';

let newAccount = async (req, res) => {

    let DataAccount = await ApiService.handleNewAccount(req.body)
    return res.status(200).json({
        errCode: DataAccount.errCode,
        message: DataAccount.message,
    })
}
let getAccount = async (req, res) => {
    let DataAccount = await ApiService.getAllAccount(req.params)
    return res.status(200).json({
        errCode: DataAccount.errCode,
        message: DataAccount.message,
        currentPage: DataAccount.currentPage,
        totalPages: DataAccount.totalPages,
        data: DataAccount.dataAccount
    })
}

let getAccountKey = async (req, res) => {
    //key
    let DataAccount = await ApiService.getAccountWhrer(req.params)
    return res.status(200).json({
        errCode: DataAccount.errCode,
        message: DataAccount.message,
        currentPage: DataAccount.currentPage,
        totalPages: DataAccount.totalPages,
        data: DataAccount.dataAccount
    })
}
// tạo api phân trang
let updateAccount = async (req, res) => {
    const page = parseInt(req.params.page, 10) || 1;
    const limit = parseInt(req.params.limit, 10) || 10;
    const offset = (page - 1) * limit;



}
module.exports = {
    getAccountKey: getAccountKey,
    newAccount: newAccount,
    getAccount: getAccount,

}