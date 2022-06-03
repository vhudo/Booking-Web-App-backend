import db from "../models/index";
require('dotenv').config()
import _ from 'lodash'
import emailService from './emailService'
import { v4 as uuidv4 } from 'uuid'

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(data)
            if (!data.email || !data.doctorId
                || !data.timeType || !data.date
                || !data.name || !data.selectedGender) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters"
                });
            } else {
                let token = uuidv4()
                // await emailService.sendSimpleEmail({
                //     receiverEmail: data.email,
                //     patientFirstName: data.firstName,
                //     patientLastName: data.lastName,
                //     time: data.timeString,
                //     doctorName: data.doctorName,
                //     language: data.language,
                //     nameClinic: data.nameClinic,
                //     addressClinic: data.addressClinic,
                //     redirectLink: buildURLEmail(data.doctorId, token),
                // })
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        gender: data.selectedGender,
                        address: data.address,
                        firstName: data.name
                    }
                })

                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { patientId: user[0].id, timeType: data.timeType, date: data.date },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            tokenBooking: token,
                            reason: data.reason
                        }
                    })
                }
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
}

let buildURLEmail = (doctorId, token) => {
    let result = `${process.env.REACT_APP_FRONTEND_URL}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result
}

let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.tokenBooking || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters"
                });
            } else {
                let appoiment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        tokenBooking: data.tokenBooking,
                        statusId: 'S1'
                    },
                    raw: false,
                })

                // console.log('appointment', appoiment)
                if (appoiment) {

                    appoiment.statusId = 'S2'
                    await appoiment.save()

                    resolve({
                        errCode: 0,
                        errMessage: "Succeed",
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: "Invalid Token",
                    })
                }
            }
        } catch (e) {
            console.log(e)
            reject(e);
        }
    });
}
module.exports = {
    postBookAppointment,
    buildURLEmail,
    postVerifyBookAppointment

};
