import db from "../models/index";
require('dotenv').config()
import _ from 'lodash'
import emailService from '../services/emailService'

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE

let getTopDoctorHome = (limitinput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit: limitinput,
        where: { roleId: "R2" },
        order: [["createdAt", "DESC"]],
        attributes: ['firstName', 'lastName', "image"],
        include: [
          {
            model: db.Doctor_Info,
            attributes: ['specialtyId'],
            include: [
              { model: db.Specialty, attributes: ['name'], },
            ]

          },
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

let checkRequiredFields = (data) => {
  let arrFields = ['doctorId', 'contentHTML', 'contentMarkdown', 'action',
    'selectedState', 'selectedPayment', 'addressClinic', 'nameClinic',]

  let isValid = true
  let element = ''
  for (let i = 0; i < arrFields.length; i++) {
    if (!data[arrFields[i]]) {
      isValid = false
      element = arrFields[i]
      break
    }
  }
  return {
    isValid: isValid,
    element: element
  }
}

let saveInfoDoctor = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log(inputData.doctorId);
      let checkObj = checkRequiredFields(inputData)
      if (checkObj.isValid === false) {
        resolve({
          errCode: 1,
          errMessage: `Missing parameters: ${checkObj.element}`,
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
        doctorInfo.specialtyId = inputData.selectedSpecialty;
        doctorInfo.clinicId = inputData.selectedClinic;
        await doctorInfo.save()
      } else {
        await db.Doctor_Info.create({
          doctorId: inputData.doctorId,
          paymentId: inputData.selectedPayment,
          stateId: inputData.selectedState,
          note: inputData.note,
          addressClinic: inputData.addressClinic,
          nameClinic: inputData.nameClinic,
          specialtyId: inputData.selectedSpecialty,
          clinicId: inputData.selectedClinic,
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
              attributes: ['nameClinic', 'addressClinic', 'note', 'paymentId', 'stateId', 'specialtyId', 'clinicId'],
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
    // console.log(data)
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

let getExtraInfoDortorById = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters"
        });
      } else {
        let data = await db.Doctor_Info.findOne({
          where: { doctorId: doctorId },
          attributes: {
            exclude: ['id', 'doctorId']
          },
          include: [
            { model: db.Allcode, as: 'stateData', attributes: ['valueEn', 'valueVi'] },
            { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
          ],
          raw: false,
          nest: true
        })
        if (!data) data = []
        resolve({
          errCode: 0,
          errMessage: "Succeed",
          data: data
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
            { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },

            {
              model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'],
              include: [
                {
                  model: db.Doctor_Info,
                  attributes: ['addressClinic', 'nameClinic'],
                },
              ]
            },


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

let getProfileDortorById = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters"
        });
      } else {
        let data = await db.User.findOne({
          where: { id: doctorId },
          attributes: {
            exclude: ['password', 'roleId', 'email', 'address', 'phonenumber']

          },
          include: [
            { model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
            { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
            {
              model: db.Doctor_Info,
              attributes: {
                exclude: ['id', 'doctorId']
              },
              include: [
                { model: db.Allcode, as: 'stateData', attributes: ['valueEn', 'valueVi'] },
                { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
              ],
            },
          ],
          raw: false,
          nest: true
        })
        if (data && data.image) {
          data.image = Buffer.from(data.image, 'base64').toString('binary')
        }
        if (!data) data = []
        resolve({
          errCode: 0,
          errMessage: "Succeed",
          data: data
        })
      }
    } catch (e) {
      console.log(e)
      reject(e);
    }
  });
};

let getListPatientForDoctor = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    console.log(doctorId)
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters"
        });
      } else {
        let data = await db.Booking.findAll({
          where: { doctorId: doctorId, date: date, statusId: 'S2' },
          include: [
            {
              model: db.User, as: 'patientData',
              attributes: ['firstName', 'email', 'address', 'gender'],
              include: [
                {
                  model: db.Allcode,
                  as: 'genderData', attributes: ['valueEn', 'valueVi']
                },
              ]
            },
            {
              model: db.Allcode,
              as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi']
            },
            {
              model: db.User,
              as: 'doctorDataPatient',
              attributes: ['firstName', 'lastName'],
              include: [
                {
                  model: db.Doctor_Info,
                  attributes: ['nameClinic', 'addressClinic'],

                },

              ],
            },
          ],
          raw: false,
          nest: true
        })

        resolve({
          errCode: 0,
          errMessage: "Succeed",
          data: data
        })
      }
    } catch (e) {
      console.log(e)
      reject(e);
    }
  });
};

let sendRemedy = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.doctorId
        || !data.patientId || !data.timeType
        || !data.imgBase64) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters"
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            patientId: data.patientId,
            timeType: data.timeType,
            statusId: 'S2'
          },
          raw: false,
        })
        if (appointment) {
          // appointment.statusId = 'S3',
          await appointment.save()
        }
        // console.log(data)
        // await emailService.sendAttachment(data)

        resolve({
          errCode: 0,
          errMessage: "Succeed",
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
  bulkCreateSchedule: bulkCreateSchedule,
  getScheduleByDate: getScheduleByDate,
  getExtraInfoDortorById, getProfileDortorById,
  getListPatientForDoctor, sendRemedy
};
