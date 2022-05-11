import db from "../models/index";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userDB = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password', 'firstName', 'lastName'],
                    where: {
                        email: email,
                    },
                })

                if (user) {
                    let isMatch = bcrypt.compareSync(password, user.password);

                    if (isMatch) {
                        userDB.errCode = 0;
                        delete user.password;
                        userDB.user = user;
                    } else {
                        userDB.errCode = 4;
                        userDB.errMessage = 'Incorrect password.';
                    }

                }
                else {
                    userDB.errCode = 3;
                    userDB.errMessage = 'User not found';
                }


            }
            else {
                userDB.errCode = 2;
                userDB.errMessage = 'Incorrect username or password.';


            }

            resolve(userDB)

        } catch (e) {
            reject(e)
        }
    })

}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {
                    email: userEmail,
                }
            })
            if (user) {
                resolve(true)
            }
            else {
                resolve(false)
            }


        } catch (e) {
            reject(e)
        }

    })
}

let getUsers = (userId) => {
    return new Promise((resolve, reject) => {
        try {
            let users = ''
            if (userId === 'ALL') {
                users = db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    },
                })

            }
            if (userId && userId !== 'ALL') {
                users = db.User.findOne({
                    where: {
                        id: userId,
                    },
                    attributes: {
                        exclude: ['password']
                    },
                })
            }

            resolve(users)


        } catch (e) {
            reject(e)
        }

    })
}


let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);

        } catch (e) {
            reject(e);
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isEmailExist = await checkUserEmail(data.email);
            // console.log('check email exist', isEmailExist)
            if (isEmailExist === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'email is already used',
                });
            } else {
                let hashPassword = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPassword,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender === 1 ? true : false,
                    roleId: data.roleId,
                })
                resolve({
                    errCode: 0,
                    message: 'ok',


                });

            }

        } catch (e) {
            reject(e)
        }
    })
}

let updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                });
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false,
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();
                resolve({
                    errCode: 0,
                    message: 'updated',
                });
            } else {
                resolve({
                    errCode: 2,
                    errMessage: 'user not found'
                });
            }



        } catch (e) {
            reject(e)
        }
    })
}


let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        // try {
        let foundUser = await db.User.findOne({
            where: { id: userId },
        })
        console.log(foundUser)
        if (!foundUser) {
            resolve({
                errCode: 2,
                message: 'User is not exist',
            });
        }
        await db.User.destroy({
            where: { id: userId }
        });
        resolve({
            errCode: 0,
            message: 'Deleted',
        });
        // } catch (e) {
        //     reject(e);
        // }
    })
}


let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                });
            } else {
                let res = {};

                let allCode = await db.Allcode.findAll({
                    where: { type: typeInput }
                });
                res.errCode = 0;
                res.data = allCode;

                resolve(res);
            }


        } catch (e) {
            reject(e)
        }

    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    checkUserEmail: checkUserEmail,
    getUsers: getUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUser: updateUser,
    getAllCodeService: getAllCodeService,
}