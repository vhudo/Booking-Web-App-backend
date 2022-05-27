import userService from '../services/userService'

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Incorrect username or password.'
        })

    }

    let userDB = await userService.handleUserLogin(email, password);



    return res.status(200).json({
        errCode: userDB.errCode,
        message: userDB.errMessage,
        user: userDB.user ? userDB.user : {}
    })
};

let handleGetUsers = async (req, res) => {
    if (!req.query.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters',
            users: []
        })

    } else {
        let users = await userService.getUsers(req.query.id);
        // console.log(users)

        return res.status(200).json({
            errCode: 0,
            errMessage: 'Ok',
            users
        })
    }

}

let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body)
    return res.status(200).json(message);

}

let handleUpdateUser = async (req, res) => {
    let data = req.body;
    let message = await userService.updateUser(data)
    return res.status(200).json(message);

}

let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters',
        })
    }
    let message = await userService.deleteUser(req.body.id)
    return res.status(200).json(message);

}


//reality
let getAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type);
        // console.log(data)
        return res.status(200).json(data);

    } catch (e) {
        console.log('Get all code error', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from service'
        })
    }
}



module.exports = {
    handleLogin: handleLogin,
    handleGetUsers: handleGetUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleUpdateUser: handleUpdateUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode,

}