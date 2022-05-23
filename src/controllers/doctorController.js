import doctorService from "../services/doctorService";

let getTopDoctorHome = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) limit = 10;
  try {
    let response = await doctorService.getTopDoctorHome(+limit);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "error from server",
    });
  }
};

let getAllDoctors = async (req, res) => {
  try {
    let doctors = await doctorService.getAllDoctors();
    return res.status(200).json(doctors);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "error from server",
    });
  }
};

let postSaveInfoDoctor = async (req, res) => {
  try {
    let response = await doctorService.saveInfoDoctor(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "error from server",
    });
  }
};

let getDetailDoctor = async (req, res) => {
  try {
    let information = await doctorService.getDetailDoctor(req.query.id);
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
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  postSaveInfoDoctor: postSaveInfoDoctor,
  getDetailDoctor: getDetailDoctor,
};
