import db from "../models/index";
require('dotenv').config()
import _ from 'lodash'


let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.name || !data.address ||
                !data.contentHTML ||
                !data.contentMarkdown ||
                !data.imageBase64
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters",
                });

            } else {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    image: data.imageBase64,
                    contentHTML: data.contentHTML,
                    contentMarkdown: data.contentMarkdown
                })
                resolve({
                    errCode: 0,
                    data,
                });
            }

        } catch (e) {
            reject(e);
        }
    });
};


let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll()
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary')
                    return item
                })

            }
            resolve({
                errMessage: 'ok',
                errCode: 0,
                data,
            });


        } catch (e) {
            reject(e);
        }
    });
};
let getDetailClinicById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters",
                });
            } else {
                let data = await db.Clinic.findOne({
                    where: { id: inputId },
                    attributes: ['contentHTML', 'contentMarkdown', 'name', 'address']

                })
                if (data) {
                    let doctorClinic = []

                    doctorClinic = await db.Doctor_Info.findAll({
                        where: { specialtyId: inputId },
                        attributes: ['doctorId', 'stateId']

                    })

                    data.doctorClinic = doctorClinic

                } else {
                    data = {}
                }


                resolve({
                    errMessage: 'ok',
                    errCode: 0,
                    data,
                });
            }

        } catch (e) {
            reject(e);
        }
    });
};
module.exports = {
    createClinic, getAllClinic, getDetailClinicById
};