import db from "../models/index";

let getTopDoctorHome = (limitinput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit: limitinput,
        where: { roleId: "R2" },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        nest: true,
        raw: true,
      });
      resolve({
        errCode: 0,
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getAllDoctors = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password", "image"],
        },
      });
      resolve({
        errCode: 0,
        data: doctors,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let saveInfoDoctor = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(inputData.doctorId);
      if (
        !inputData.doctorId ||
        !inputData.contentHTML ||
        !inputData.contentMarkdown
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameters",
        });
      } else {
        await db.Markdown.create({
          contentHTML: inputData.contentHTML,
          contentMarkdown: inputData.contentMarkdown,
          description: inputData.description,
          doctorId: inputData.doctorId,
        });
      }
      resolve({
        errCode: 0,
        Message: "Save info doctor succeed",
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getDetailDoctor = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters!'
        });
      }
      else {
        let dataInfo = await db.User.findOne({
          where: { id: inputId },
          attributes: {
            exclude: ["password", "image", 'gender', 'roleId'],
          },
          include: [
            { model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },

          ],
          nest: true,
          raw: true,
        });
        resolve({
          errCode: 0,
          data: dataInfo,
        });
      }


    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  saveInfoDoctor: saveInfoDoctor,
  getDetailDoctor: getDetailDoctor
};
