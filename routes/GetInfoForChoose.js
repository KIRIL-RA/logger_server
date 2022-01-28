var { GetExistLogs } = require("../сlasses/Logic");
const DBWork = require('../сlasses/DBWork');
const Logger = require('../сlasses/Logger');
const User = require("../сlasses/User");
const ResponseSamples = require("../сlasses/ResponseSamples");
var express = require('express');
const { UserLoginDataIncorrectError, UserNotFoundError } = require("../сlasses/Exceptions/UserExceptions");
const StatusCodes = require("../static/StatusCodes.json");

var router = express.Router();

router.get('/', (req, res, next) => {
    let userName = req.query.username;
    let userHashAccess = req.query.hashaccess;

    let logger = new Logger(true);

    if (userName === undefined ||
        userHashAccess === undefined) {
        // If not all parameters were recieved send response, and stop saving file
        res.end(ResponseSamples.DefaultResponse("Not all parameters were recieved", StatusCodes.NOT_ALL_PARAMETERS_WERE_RECIEVED));
        return;
    }

    try {
        // Trying to get info about devices and their logs
        let devicesData = [];

        let dbWork = new DBWork();
        let user = new User(userName, userHashAccess, dbWork);

        user.Login();

        let userData = user.userData;
        let userDevices = userData.devices;

        // Formong array, contains devices info and their logs
        userDevices.forEach(device => {
            devicesData.push({'name' : device.name, 'id': device.id, 'lastSynchronization': device.lastSync, 'logs' : GetExistLogs(user.userData.userHash, device.id)});
        });

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