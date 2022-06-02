import clinicService from "../services/clinicService";

let createClinic = async (req, res) => {
    try {
        let information = await clinicService.createClinic(req.body);
        return res.status(200).json(information);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "error from server",
        });
    }
};
let getAllClinic = async (req, res) => {
    try {
        let information = await clinicService.getAllClinic();
        return res.status(200).json(information);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "error from server",
        });
    }
}
let getDetailClinicById = async (req, res) => {
    try {
        let information = await clinicService.getDetailClinicById(req.query.id);
        return res.status(200).json(information);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "error from server",
        });
    }
}
module.exports = {
    createClinic, getAllClinic, getDetailClinicById
};
