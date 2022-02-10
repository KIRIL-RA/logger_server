var { GetExistLogs } = require("../сlasses/Logic");
const { DBWork, LCADatabase } = require('../сlasses/DBWork');
const Logger = require('../сlasses/Logger');
const { UserWithToken } = require("../сlasses/User");
const ResponseSamples = require("../сlasses/ResponseSamples");
var express = require('express');
const { UserLoginDataIncorrectError, UserNotFoundError } = require("../сlasses/Exceptions/UserExceptions");
const StatusCodes = require("../static/StatusCodes.json");

var router = express.Router();

router.get('/', async function (req, res, next) {
    let userHash = req.cookies.userHash;
    let sessionToken = req.cookies.sessionToken;

    let logger = new Logger(true);

    if (userHash === undefined ||
        sessionToken === undefined) {
        // If authentication parameters not recieved, send error response
        res.end(ResponseSamples.DefaultResponse("Login data not recieved", StatusCodes.USER_LOGIN_ERROR));
        return;
    }

    try {
        await LCADatabase.Connect();
        // Trying to get info about devices and their logs
        let devicesData = [];

        let user = new UserWithToken(userHash, sessionToken, LCADatabase);

        await user.Login();

        let userData = user.GetUserData();
        let userDevices = userData.devices;

        // Formong array, contains devices info and their logs
        userDevices.forEach(device => {
            devicesData.push({'name' : device.name, 'id': device.id, 'lastSynchronization': device.lastSync, 'logs' : GetExistLogs(user.userData.userHash, device.id)});
        });

        await LCADatabase.CloseConnection();
        res.end(ResponseSamples.ToUserInfoForChoose(devicesData, StatusCodes.SUCCESFUL_SENDED_INFO_FO_CHOOSE));
        return;
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
                res.end(ResponseSamples.DefaultResponse("Error get info", StatusCodes.GET_INFO_ERROR));
                return;
        }
    }

});

module.exports = router;