require('dotenv').config()
import nodemailer from 'nodemailer'

let sendSimpleEmail = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.EMAIL_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Vu" <vh.ho8160@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: getSubjectEmail(dataSend), // Subject line
        html: getBodyHTMLEmail(dataSend),

    });
}

let getBodyHTMLEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'en') {
        result = `
        <p>Dear <b>${dataSend.patientName}</b>,</p>
        <p> We are emailing to confirm your appoiment on <b>${dataSend.time}
        </b> with <b>${dataSend.doctorName}</b> at our clinic on </p>
        <div><b>${dataSend.nameClinic}</b></div>
        <div><b>${dataSend.addressClinic}</b></div>
        <p> We ask that you please bring your ID, insurance card and
        a list of medications with you to your appoitment.
        A co-pay may be due at the time of service.
        Please plan to arrive 20 minutes early to complete any neccessary paperwork. </p>        
        <p>We look forward to providing you the best possible care. </p>
        <p>Thank you for choosing <b>${dataSend.nameClinic}</b></p>
        <p><b>${dataSend.patientName}</b>, Click this link to confirm your appoitment </p>

        <div> <a href=${dataSend.redirectLink} target = "_blank" >${dataSend.redirectLink}</a> </div>
        <p>The link will expire after 24 hours.</p>
        `
    }
    if (dataSend.language === 'vi') {

    }
    return result
}

let getSubjectEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'en') {
        result = "Appointment Confirm"
    }
    if (dataSend.language === 'vi') {
        result = "Xác nhận thông tin lịch khám bệnh"
    }
    return result
}




module.exports = {
    sendSimpleEmail

};