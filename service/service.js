'use strict';

const superagent = require('superagent');
const moment = require('moment');
const nodemailer = require('nodemailer');

async function getVaccineData() {
  try {
    let now = new Date();
    let currentTime = moment(now).format('MMMM Do YYYY, h:mm:ss a')
    let dateString = moment(now).format('DD-MM-YYYY');
    const queryArguments = {
      district_id: '776',
      date: dateString,
    };

    const response = await superagent
      .get(
        'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict'
      )
      .query(queryArguments);
    prepareData(response.body, currentTime);
  } catch (error) {
    console.error('error data: %j', error);
  }
}

function prepareData(vaccineData, currentTime) {
  if (vaccineData && vaccineData.centers && vaccineData.centers.length > 0) {
    let mailMessage = '';
    vaccineData.centers.forEach((elem) => {
      if (elem.sessions && elem.sessions.length > 0) {
        elem.sessions.forEach((ses) => {
          if (ses.min_age_limit === 18 && ses.available_capacity > 0) {
            mailMessage = mailMessage + `\n \n DATE - ${ses.date} , VACCINE - ${ses.vaccine} , PLACE - ${elem.name} , pincode - ${elem.pincode}`;
          }
        });
      }
    });
    mailMessage = mailMessage.trim()
    if(mailMessage.length > 0) {
        sendEmail(mailMessage, currentTime);
    }
  }
}

function sendEmail(mailMessage, currentTime) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'udit291096@gmail.com',
      pass: 'betheMasterUdit@2910',
    },
  });

  let mailOptions = {
    from: 'udit291096@gmail.com',
    to: 'uditdj29@gmail.com',
    bcc: 'bon30996@gmail.com,dishankl07@gmail.com,yashpals981@gmail.com,mehtasmit735@gmail.com,jainamshah.1105@gmail.com,savanimohit117@gmail.com,kvnsavaliya@gmail.com',
    subject: `Vaccine Available - ${currentTime}`,
    text: mailMessage
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
});
}

module.exports = {
  getVaccineData,
};
