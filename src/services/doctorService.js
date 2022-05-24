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
        !inputData.contentMarkdown ||
        !inputData.action
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameters",
        });
      } else {
        if (inputData.action === 'CREATE') {
          await db.Markdown.create({
            contentHTML: inputData.contentHTML,
            contentMarkdown: inputData.contentMarkdown,
            description: inputData.description,
            doctorId: inputData.doctorId,
          });
        }
        if (inputData.action === 'EDIT') {
          let markdown = await db.Markdown.findOne({
            where: { doctorId: inputData.doctorId },
            raw: false
          })

          if (markdown) {
            markdown.contentHTML = inputData.contentHTML;
            markdown.contentMarkdown = inputData.contentMarkdown;
            markdown.description = inputData.description;
            await markdown.save()
          }

        }


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
        let data = await db.User.findOne({
          where: { id: inputId },
          attributes: {
            exclude: ["password", 'roleId'],
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
          raw: false,
        });

        if (data && data.image) {
          data.image = new Buffer(data.image, 'base64').toString('binary')
        }

        if (!data) data = {}

        resolve({
          errCode: 0,
          data: data,
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
