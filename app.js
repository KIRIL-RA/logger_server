var express = require('express');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var morgan = require('morgan')
const path = require('path')
var app = express();

var uploadFilesRoute = require('./routes/UploadFile');
var checkSynchronizationRoute = require('./routes/CheckSynchronization');
var getInfoForChoise = require('./routes/GetInfoForChoose');
var getAnalytics = require('./routes/GetAnalytics');
var showAnalytics = require('./routes/ShowAnalytics');
var CreateNewSessionToken = require('./routes/Login');
var getUserInfo = require('./routes/GetUserInfo');
var selectDate = require('./routes/SelectDate');

app.use(cookieParser());
app.use(morgan('combined'))
app.use(bodyParser.json());
app.use(express.static('node_modules'));
app.use(express.static('static'));
app.use("/analytics/selectdate", selectDate);
app.use("/upload", uploadFilesRoute);
app.use("/checksync", checkSynchronizationRoute);
app.use("/getinfochoise", getInfoForChoise);
app.use("/getanalytics", getAnalytics);
app.use("/showanalytics", showAnalytics);
app.use("/createsessiontoken", CreateNewSessionToken);
app.use("/getuserinfo", getUserInfo);
app.get('/uploadpage', function (req, res) {
   res.setHeader('content-type', 'text/html;charset=utf-8');
   res.write('<link rel="stylesheet" href="css/style.css">');
   res.write('<select><option>Пункт 1</option><option>Пункт 2</option></select>');
   res.write('<form action="/upload?deviceId=401&devicehashaccess=aaabbb" method="POST" enctype="multipart/form-data">');
   res.write('<input type="file" multiple="multiple" name="avatar">');
   res.write('<input type="submit">');
   res.write('</form>');
   res.end();
});

app.use((req, res, next) => {res.sendFile(path.join(__dirname+'/static_hidden/404/index.html'));});

var server = app.listen(8081, function () {

   var host = server.address().address;
   var port = server.address().port;

   console.log("Example app listening at http://%s:%s", host, port)
});