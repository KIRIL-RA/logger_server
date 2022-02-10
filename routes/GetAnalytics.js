const { UserLoginDataIncorrectError, UserNotFoundError } = require("../сlasses/Exceptions/UserExceptions");
const ResponseSamples = require("../сlasses/ResponseSamples");
const StatusCodes = require("../static/StatusCodes.json");
const { GetSimpleAnalytics } = require("../сlasses/Logic");
const Logger = require('../сlasses/Logger');
const { DBWork, LCADatabase } = require('../сlasses/DBWork');
const { UserWithToken } = require("../сlasses/User");
var express = require('express');
var router = express.Router();

router.get('/:year/:month/:date', async function (req, res, next) {
    let userHash = req.cookies.userHash;
    let sessionToken = req.cookies.sessionToken;
    let deviceId = req.query.deviceid;
    let date = { year: req.params.year, month: req.params.month, day: req.params.date };

    let logger = new Logger(true);
    
    if (userHash === undefined ||
        sessionToken === undefined) {
        // If authentication parameters not recieved, send error response
        res.end(ResponseSamples.DefaultResponse("Login data not recieved", StatusCodes.USER_LOGIN_ERROR));
        return;
    }

    if (deviceId === undefined) {
        // If not all parameters were recieved send response, and stop saving file
        res.end(ResponseSamples.DefaultResponse("Not all parameters were recieved", StatusCodes.NOT_ALL_PARAMETERS_WERE_RECIEVED));
        return;
    }

    try {
        await LCADatabase.Connect();
        // Trying to get analytics for choosed period 
        let user = new UserWithToken(userHash, sessionToken, LCADatabase);

        await user.Login();

        let userData = user.GetUserData();

        let deviceData = user.GetDeviceData(parseInt(deviceId));
        let result = await GetSimpleAnalytics(userData.userHash, deviceData.id, date);

        await LCADatabase.CloseConnection();
        res.end(ResponseSamples.ToUserAnalyticsResult(deviceData, result, StatusCodes.ANALYTICS_SUCCESFUL_SENDED));
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