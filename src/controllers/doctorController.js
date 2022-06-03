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

let bulkCreateSchedule = async (req, res) => {
  try {
    let information = await doctorService.bulkCreateSchedule(req.body);
    return res.status(200).json(information);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "error from server",
    });
  }
}

let getScheduleByDate = async (req, res) => {
  try {
    let information = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date);
    return res.status(200).json(information);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "error from server",
    });
  }
}

let getExtraInfoDortorById = async (req, res) => {
  try {
    let information = await doctorService.getExtraInfoDortorById(req.query.doctorId);
    return res.status(200).json(information);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "error from server",
    });
  }
}

let getProfileDortorById = async (req, res) => {
  try {
    let information = await doctorService.getProfileDortorById(req.query.doctorId);
    return res.status(200).json(information);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "error from server",
    });
  }
}
let getListPatientForDoctor = async (req, res) => {
  try {
    let information = await doctorService.getListPatientForDoctor(req.query.doctorId, req.query.date);
    return res.status(200).json(information);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "error from server",
    });
  }
}

let sendRemedy = async (req, res) => {
  try {
    let information = await doctorService.sendRemedy(req.body);
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
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  postSaveInfoDoctor: postSaveInfoDoctor,
  getDetailDoctor: getDetailDoctor,
  bulkCreateSchedule,
  getScheduleByDate,
  getExtraInfoDortorById,
  getProfileDortorById, getListPatientForDoctor, sendRemedy
};
