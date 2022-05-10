import bcrypt from "bcryptjs";
import db from "../models/index";

const salt = bcrypt.genSaltSync(10);


let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
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
            let allUser = await db.User.findAll();
            resolve(allUser);
        } catch (e) {
            reject(e);
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

let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                raw: true,
            });
            resolve(users);
        } catch (e) {
            reject(e);
        }

    })

}

let getUserInforById = (userId) => {
    return new Promise(async (relsove, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: true
            })
            if (user) {
                relsove(user);
            } else {
                relsove({});
            }
        } catch (e) {
            reject(e);
        }
    })

}



let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id },
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();

                let allUser = await db.User.findAll();
                resolve(allUser);
            }

            resolve();

        } catch (e) {
            reject(e);
        }
    })
}

let deleteUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
            })
            if (user) {
                await user.destroy();
                let allUser = await db.User.findAll();
                resolve(allUser);
            }

            resolve();
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInforById: getUserInforById,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById,
}
