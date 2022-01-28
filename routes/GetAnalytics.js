const { UserLoginDataIncorrectError, UserNotFoundError } = require("../сlasses/Exceptions/UserExceptions");
const ResponseSamples = require("../сlasses/ResponseSamples");
const StatusCodes = require("../static/StatusCodes.json");
const { GetAnalytics } = require("../сlasses/Logic");
const Logger = require('../сlasses/Logger');
const DBWork = require('../сlasses/DBWork');
const User = require("../сlasses/User");
var express = require('express');
var router = express.Router();

router.get('/:year/:month/:date', (req, res, next) => {
    let userName = req.query.username;
    let userHashAccess = req.query.hashaccess;
    let deviceId = req.query.deviceid;
    let date = { year: req.params.year, month: req.params.month, day: req.params.date };

    let logger = new Logger(true);

    if (userName === undefined ||
        userHashAccess === undefined ||
        deviceId === undefined) {
        // If not all parameters were recieved send response, and stop saving file
        res.end(ResponseSamples.DefaultResponse("Not all parameters were recieved", StatusCodes.NOT_ALL_PARAMETERS_WERE_RECIEVED));
        return;
    }

    try {
        // Trying to get analytics for choosed period 

        let dbWork = new DBWork();
        let user = new User(userName, userHashAccess, dbWork);

        user.Login();

        let deviceData = user.GetDeviceData(parseInt(deviceId));
        GetAnalytics(user.userData.userHash, deviceData.id, date)
            .then(result => {
                 res.end(ResponseSamples.ToUserAnalyticsResult(deviceData, result, StatusCodes.ANALYTICS_SUCCESFUL_SENDED));
                })
            .catch(e => {
                switch (e.name) {
                    default:
                        res.end(ResponseSamples.DefaultResponse("Error get analytics", StatusCodes.GET_ANALYTICS_ERROR));
                        return;
                }
            });
    }
    
    catch (e) {
        switch (e.name) {
            case new UserNotFoundError().name:
                res.end(ResponseSamples.DefaultResponse("Incorrect user login data", StatusCodes.USER_LOGIN_ERROR));
                return

            case new UserLoginDataIncorrectError().name:
                res.end(ResponseSamples.DefaultResponse("Incorrect user login data", StatusCodes.USER_LOGIN_ERROR));
                return;

            default:
                res.end(ResponseSamples.DefaultResponse("Error get analytics", StatusCodes.GET_ANALYTICS_ERROR));
                return;
        }
    }
});

module.exports = router;