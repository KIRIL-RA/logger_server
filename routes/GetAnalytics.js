const { UserLoginDataIncorrectError, UserNotFoundError } = require("../сlasses/Exceptions/UserExceptions");
const ResponseSamples = require("../сlasses/ResponseSamples");
const StatusCodes = require("../static/StatusCodes.json");
const { GetAnalytics } = require("../сlasses/Logic");
const Logger = require('../сlasses/Logger');
const { DBWork, LCADatabase } = require('../сlasses/DBWork');
const User = require("../сlasses/User");
var express = require('express');
var router = express.Router();

router.get('/:year/:month/:date', async function (req, res, next) {
    let userName = req.query.username;
    let userPassword = req.query.password;
    let deviceId = req.query.deviceid;
    let date = { year: req.params.year, month: req.params.month, day: req.params.date };

    let logger = new Logger(true);

    if (userName === undefined ||
        userPassword === undefined ||
        deviceId === undefined) {
        // If not all parameters were recieved send response, and stop saving file
        res.end(ResponseSamples.DefaultResponse("Not all parameters were recieved", StatusCodes.NOT_ALL_PARAMETERS_WERE_RECIEVED));
        return;
    }

    try {
        await LCADatabase.Connect();
        // Trying to get analytics for choosed period 
        let user = new User(userName, userPassword, LCADatabase);

        await user.Login();

        let deviceData = user.GetDeviceData(parseInt(deviceId));
        GetAnalytics(user.userData.userHash, deviceData.id, date)
            .then(async function(result) {
                await LCADatabase.CloseConnection();
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