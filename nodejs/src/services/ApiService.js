import db from '../models/index';
var request = require('request');

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
let deleteUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.allaccount.findOne({
                where: { key: userId }
            })
            if (user) {
                await user.destroy();
                resolve('done');
            }
            else {
                resolve('no done');
            }


        } catch (e) {
            reject(e);
        }
    })
}
let get_formula_data = () => {
    return new Promise(async (resolve, reject) => {
        try {
            var options = {
                'method': 'POST',
                'url': 'https://www.hackbcr.com/get_formula_data',
                'headers': {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Cookie': '_ga=GA1.1.771764865.1679073686; _ga_7YQ9ZVWY3D=GS1.1.1679073685.1.1.1679074089.0.0.0; XSRF-TOKEN=eyJpdiI6Ik5aTHVxTGVVSzQydUpwN0xvbVppWUE9PSIsInZhbHVlIjoiVmFEMUx3VVcwem9nQ1A0MDlZTzUweE4wdWZPY1RIc0lxUkVuM3l2dVpzNVhIcU5sa0VFZ05rTGtlWWVJVUhLOWEzUEx6N1pUdjZuMzZZUVkzT0FScjVSQkNaZU01ai9FY05oTVhmQTBicm5aek8xWXh5T2JoMHZCRXFDdDBiK3YiLCJtYWMiOiJiNzU0ZjRhYjFlYzE0OGY4NTExZTc4ZDlkZjUxM2I5YjFjNDljNmIxYTRmMWE3NmJkZTc2ZGUwOGY1MWExYWJjIn0=; hackbcr_session=eyJpdiI6ImxFMkllQk1sTlg5QmdXL2xPTnRPaXc9PSIsInZhbHVlIjoidktRaTBXYytydUQ1a3l2MnRIWlhjLzNrL2tWTitRZXNMKzBOOGJxYVl4SkFaVVpwVkhSdVZSTUZFSnhzV2prV1hVK0ZjUFNBQ1B6cDg0WURITW5UeU9NTzFvNnRiU0pmZG96T0tOS2hPVTFOdi9MdDhqMGp5bGJ5NmRLZmp3d24iLCJtYWMiOiJmODIyZGJhNzc3ODRlMDM0MWNlMzUwNmNhYTFmNWMzZWQ4M2YyODU0YzBlYjA5NDlkMmMxZWRjYTI5YjQwZGY0In0=',
                    'X-CSRF-TOKEN': 'YODpVjqu9AWLDRQxcoBmSvT3rZLI7jleXxG3qbaY'
                },
                form: {
                    'url': 'sagaming'
                }
            };
            request(options, async function (error, response) {
                if (error) throw new Error(error);
                console.log(response.body);
                await resolve(response.body);
            });

            //resolve('no done');

        } catch (e) {
            reject(e);
        }
    })
}
let getresult = () => {
    return new Promise(async (resolve, reject) => {
        try {
            var options = {
                'method': 'POST',
                'url': 'https://www.hackbcr.com/baccarat/getresult',
                'headers': {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Cookie': '_ga=GA1.1.771764865.1679073686; _ga_7YQ9ZVWY3D=GS1.1.1679073685.1.1.1679074089.0.0.0; XSRF-TOKEN=eyJpdiI6Ik5aTHVxTGVVSzQydUpwN0xvbVppWUE9PSIsInZhbHVlIjoiVmFEMUx3VVcwem9nQ1A0MDlZTzUweE4wdWZPY1RIc0lxUkVuM3l2dVpzNVhIcU5sa0VFZ05rTGtlWWVJVUhLOWEzUEx6N1pUdjZuMzZZUVkzT0FScjVSQkNaZU01ai9FY05oTVhmQTBicm5aek8xWXh5T2JoMHZCRXFDdDBiK3YiLCJtYWMiOiJiNzU0ZjRhYjFlYzE0OGY4NTExZTc4ZDlkZjUxM2I5YjFjNDljNmIxYTRmMWE3NmJkZTc2ZGUwOGY1MWExYWJjIn0=; hackbcr_session=eyJpdiI6ImxFMkllQk1sTlg5QmdXL2xPTnRPaXc9PSIsInZhbHVlIjoidktRaTBXYytydUQ1a3l2MnRIWlhjLzNrL2tWTitRZXNMKzBOOGJxYVl4SkFaVVpwVkhSdVZSTUZFSnhzV2prV1hVK0ZjUFNBQ1B6cDg0WURITW5UeU9NTzFvNnRiU0pmZG96T0tOS2hPVTFOdi9MdDhqMGp5bGJ5NmRLZmp3d24iLCJtYWMiOiJmODIyZGJhNzc3ODRlMDM0MWNlMzUwNmNhYTFmNWMzZWQ4M2YyODU0YzBlYjA5NDlkMmMxZWRjYTI5YjQwZGY0In0=',
                    'X-CSRF-TOKEN': 'YODpVjqu9AWLDRQxcoBmSvT3rZLI7jleXxG3qbaY'
                },
                form: {
                    'url': 'sagaming'
                }
            };
            request(options, async function (error, response) {
                if (error) throw new Error(error);
                console.log(response.body);
                await resolve(response.body);
            });

            //resolve('no done');

        } catch (e) {
            reject(e);
        }
    })
}

let Check_login = () => {
    return new Promise(async (resolve, reject) => {
        try {
            var options = {
                'method': 'POST',
                'url': 'https://www.hackbcr.com/check_login',
                'headers': {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Cookie': 'XSRF-TOKEN=eyJpdiI6InIxMll3a1hCaU9jbjNNWnZwbWN4Y0E9PSIsInZhbHVlIjoiZ0lldEpER3FuZTB1ODNLcnFLdnc1cUlLbXBudGgrVWo3MWhjRWxTZXhsY3pTLzUwZ0pHVmdHd3NYbUd4WVBwREVseTVTMVUyQkVhS1BtemVZZlp6VlJuRDB6UGRsbE9laTdPd2locEVWVXlHdnZSeFFySGxPcWNkSklqUDh1dWciLCJtYWMiOiI0MWYyYjZlYzE1NmVmYTJhYWM5ODA4N2Y3M2Q2NjAwY2FmYjY4NjljYzMwYWE2YWUwNmMwYjc3NjdlOTQ5ZGFkIn0%3D; expires=Wed, 15-Mar-2023 19:19:40 GMT; Max-Age=7200; path=/; samesite=lax;hackbcr_session=eyJpdiI6IllweEt4NVdaR3ZTV3dHalRTVE41QWc9PSIsInZhbHVlIjoiWWNHNHllR3YxeXk2dDdmWC9DT1lUUVlYa2dpcTViMkVFMzNNWnpuWFFDWEM4WlBwVkdMTFN3MW1hbzRKTWVqWnBxelJSZ3JPZDhUZHdqYllRQ283VG85VU5DdjloZllVYTI1b2JUcjcra1Y2S3JuRzNrL0RZQTFGakQ1MjhyQXQiLCJtYWMiOiIxNTdlZjNjMmYyZmIzYmZjYzdiYzkxMTU5ZWYwNjY5OTZiZjg2NDJjNWU4ZmZmNGNhM2FjMmE1MDgwYTNiZTM3In0%3D; expires=Wed, 15-Mar-2023 19:19:40 GMT; Max-Age=7200; path=/; httponly; samesite=lax',
                    'X-CSRF-TOKEN': '2QmP8AHJrsplbbo1xd5GRH8veHI8Qs1O6EtRLxOH'
                },
                form: {
                    'url': 'sagaming'
                }
            };
            request(options, function (error, response) {
                if (error) throw new Error(error);
                console.log(response.body);
                resolve(response.body);
            });

            //resolve('no done');

        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    deleteUserById: deleteUserById,
    handleNewAccount: handleNewAccount,
    getAllAccount: getAllAccount,
    getAccountWhrer: getAccountWhrer,
    get_formula_data: get_formula_data,
    getresult: getresult
}