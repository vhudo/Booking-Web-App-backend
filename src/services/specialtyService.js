import db from "../models/index";
require('dotenv').config()
import _ from 'lodash'


let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.name ||
                !data.contentHTML ||
                !data.contentMarkdown ||
                !data.imageBase64
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters",
                });

            } else {
                await db.Specialty.create({
                    name: data.name,
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

let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll()
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

module.exports = {
    createSpecialty, getAllSpecialty
};
