import db from "../models/index";
require('dotenv').config()
import _ from 'lodash'

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE

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
        raw: false,
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
      // console.log(inputData.doctorId);
      if (
        !inputData.doctorId ||
        !inputData.contentHTML ||
        !inputData.contentMarkdown ||
        !inputData.action ||
        !inputData.selectedState ||
        !inputData.selectedPayment ||
        !inputData.addressClinic ||
        !inputData.nameClinic
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
        } else if (inputData.action === 'EDIT') {
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

      let doctorInfo = await db.Doctor_Info.findOne({
        where: { doctorId: inputData.doctorId },
        raw: false
      })
      if (doctorInfo) {
        doctorInfo.paymentId = inputData.selectedPayment;
        doctorInfo.stateId = inputData.selectedState;
        doctorInfo.note = inputData.note;
        doctorInfo.addressClinic = inputData.addressClinic;
        doctorInfo.nameClinic = inputData.nameClinic;
        await doctorInfo.save()
      } else {
        await db.Doctor_Info.create({
          doctorId: inputData.doctorId,
          paymentId: inputData.selectedPayment,
          stateId: inputData.selectedState,
          note: inputData.note,
          addressClinic: inputData.addressClinic,
          nameClinic: inputData.nameClinic,
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
            {
              model: db.Doctor_Info,
              attributes: ['nameClinic', 'addressClinic', 'note', 'paymentId', 'stateId'],
              include: [
                { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
              ]
            },

          ],
          nest: true,
          raw: false,
        });

        if (data && data.image) {
          data.image = Buffer.from(data.image, 'base64').toString('binary')
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

let bulkCreateSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    console.log(data)
    try {
      if (!data.arrSchedule || !data.doctorId || !data.FormatedDate) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters"
        });
      } else {
        let schedule = data.arrSchedule
        if (schedule && schedule.length > 0) {
          schedule = schedule.map((item) => {
            item.maxNumber = MAX_NUMBER_SCHEDULE
            return item
          })
        }

        let dataExist = await db.Schedule.findAll({
          where: { doctorId: data.doctorId, date: '' + data.FormatedDate },
          attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],

        })

        let toCreate = _.differenceWith(schedule, dataExist, (a, b) => {
          return a.timeType === b.timeType && +a.date === +b.date;
        })

        // console.log('check difference:', toCreate)

        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate)
        }

        resolve({
          errCode: 0,
          errMessage: "Succeed"
        })

      }
    } catch (e) {
      console.log(e)
      reject(e);
    }
  });
};

let getScheduleByDate = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters"
        });
      } else {
        let dataSchedule = await db.Schedule.findAll({
          where: { doctorId: doctorId, date: date },
          include: [
            { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] }
          ],
          raw: false,
          nest: true
        })
        if (!dataSchedule) dataSchedule = []
        resolve({
          errCode: 0,
          errMessage: "Succeed",
          data: dataSchedule
        })


      }
    } catch (e) {
      console.log(e)
      reject(e);
    }
  });
};


module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  saveInfoDoctor: saveInfoDoctor,
  getDetailDoctor: getDetailDoctor,
  bulkCreateSchedule: bulkCreateSchedule
  , getScheduleByDate: getScheduleByDate,
};
