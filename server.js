const express = require('express');
const app = express();
const port = 3600;
const cookieParser = require('cookie-parser')
const cors = require('cors');
const { getVaccineData } = require('./service/service');
const cron = require('node-cron');


app.listen(port, () => console.log('listening on port %s', port));



app.use(cors());
app.use(cookieParser());

app.use(function (req, res, next) {
  console.log('time :', Date.now());
});

cron.schedule('*/5 * * * * *', () => {
    getVaccineData();
})
