import db from '../models/index';


let handleNewAccount = (data, io) => {
    return new Promise(async (resolve, reject) => {
        console.log(data);
        try {

            let userData = {};
            //let isExist = await checkExitAccount(data.machinename + data.serialnumber + data.profilename);
            let account = await db.allaccount.findOne({
                where: { key: data.machinename + data.serialnumber + data.profilename }
            })
            if (account) {
                //đưa vào database update
                await db.updateaccount.create({
                    key: data.machinename + data.serialnumber + data.profilename,
                    machinename: data.machinename,
                    serialnumber: data.serialnumber,
                    profilename: data.profilename,
                    checkbm: data.checkbm,
                    birthday: data.birthday,
                    uid: data.uid,
                    countaccount: data.countaccount,
                    Ideal: data.Ideal,
                    status: 'update',
                    pickdate: data.pickdate,
                    country: data.country,
                    ip: data.ip,
                    update: data.update,
                })

                account.set({
                    update: account.dataValues.update + 1
                })

                await account.save();
                userData.errCode = 0;
                userData.message = 'update account succeed';
                io.emit('test', 'update account succeed');
                //tìm theo key và update thông số
            }
            else {
                await db.allaccount.create({
                    key: data.machinename + data.serialnumber + data.profilename,
                    machinename: data.machinename,
                    serialnumber: data.serialnumber,
                    profilename: data.profilename,
                    checkbm: data.checkbm,
                    birthday: data.birthday,
                    uid: data.uid,
                    countaccount: data.countaccount,
                    Ideal: data.Ideal,
                    status: 'New',
                    pickdate: data.pickdate,
                    country: data.country,
                    ip: data.ip,
                    update: data.update,
                })
                userData.errCode = 0;
                userData.message = 'create new account succeed';
                io.emit('test', 'create new account succeed');
            }

            resolve(userData);

        } catch (e) {
            reject(e);
        }
    })
}
let checkExitAccount = (key) => {
    return new Promise(async (resolve, reject) => {
        try {
            let account = await db.allaccount.findOne({
                where: { key: key }
            })
            if (account) {
                resolve(account)
            } else {
                resolve(false)
            }

        } catch (e) {
            reject(e)
        }
    })
}




let getAllAccount = (params) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            const page = parseInt(params.page, 10) || 1;
            const limit = parseInt(params.limit, 10) || 10;
            const offset = (page - 1) * limit;
            let dataAccount = await db.allaccount.findAndCountAll({
                limit: limit,
                offset: offset,
                raw: true,
                order: [
                    ['updatedAt', 'DESC'],
                    ['update', 'DESC'],

                ]
            });
            data.errCode = 0;
            data.message = "succeed";
            data.currentPage = page;
            data.totalPages = Math.ceil(dataAccount.count / limit),
                data.dataAccount = dataAccount;
            resolve(data)
        } catch (e) {
            reject(e);
        }
    })
}
let FindTableAccount = (key) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            let dataAccount = await db.updateaccount.findOne({
                raw: true,
                where: { key: params.key }
            });
            data.errCode = 0;
            data.message = "succeed";
            data.currentPage = page;
            data.totalPages = Math.ceil(dataAccount.count / limit),
                data.dataAccount = dataAccount;
            resolve(data)
        } catch (e) {
            reject(e);
        }
    })
}
let getAccountWhrer = (params) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            const page = parseInt(params.page, 10) || 1;
            const limit = parseInt(params.limit, 10) || 10;
            const offset = (page - 1) * limit;
            let dataAccount = await db.updateaccount.findAndCountAll({
                limit: limit,
                offset: offset,
                raw: true,
                order: [
                    ['updatedAt', 'DESC'],
                ],
                where: { key: params.key }
            });
            data.errCode = 0;
            data.message = "succeed";
            data.currentPage = page;
            data.totalPages = Math.ceil(dataAccount.count / limit),
                data.dataAccount = dataAccount;

            let account = await db.allaccount.findOne({
                where: { key: params.key }
            })
            account.set({
                update: 0
            })
            await account.save();
            resolve(data)
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    handleNewAccount: handleNewAccount,
    getAllAccount: getAllAccount,
    getAccountWhrer: getAccountWhrer
}