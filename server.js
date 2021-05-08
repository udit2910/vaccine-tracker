const express = require('express');
const app = express();
const port = 3600;
const cookieParser = require('cookie-parser')
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');
const { getVaccineData } = require('./service/service');


app.listen(port, () => console.log('listening on port %s', port));



app.use(cors());
app.use(cookieParser());

app.use(function (req, res, next) {
  console.log('time :', Date.now());
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
  
    app.get('*', (req, res) =>
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    );
  }
  

cron.schedule('*/5 * * * * *', () => {
    getVaccineData();
})
