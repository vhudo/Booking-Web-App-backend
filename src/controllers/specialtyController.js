import specialtyService from "../services/specialtyService";

let createSpecialty = async (req, res) => {
    try {
        let information = await specialtyService.createSpecialty(req.body);
        return res.status(200).json(information);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "error from server",
        });
    }
}
let getAllSpecialty = async (req, res) => {
    try {
        let information = await specialtyService.getAllSpecialty();
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
    createSpecialty, getAllSpecialty
};
