
import db from "../models/index";

let postBookAppointment = async (req, res) => {
    try {
        let information = await doctorService.getProfileDortorById(req.body);
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
    postBookAppointment
};
