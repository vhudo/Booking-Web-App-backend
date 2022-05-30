
import patientService from "../services/patientService";

let postBookAppointment = async (req, res) => {
    try {
        let information = await patientService.postBookAppointment(req.body);
        return res.status(200).json(information);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "error from server",
        });
    }
};

let postVerifyBookAppointment = async (req, res) => {
    try {
        let information = await patientService.postVerifyBookAppointment(req.body);
        return res.status(200).json(information);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "error from server",
        });
    }
};


module.exports = {
    postBookAppointment,
    postVerifyBookAppointment
};
