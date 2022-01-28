const Logger = require('../сlasses/Logger');
const DBWork = require('../сlasses/DBWork');
const Device = require('../сlasses/Device');
const { DeviceLoginDataIncorrectError, DeviceNotExistError  } = require("../сlasses/Exceptions/DeviceExceptions");
const ResponseSamples = require("../сlasses/ResponseSamples");
const StatusCodes = require("../static/StatusCodes.json");

var express = require('express');
var { IsFileExist } = require('../сlasses/File');
var router = express.Router();


/**
 * Check synchronized files
 */
router.post('/', (req, res, next) => {
    let fileNames = req.body.fileNames;
    let deviceId = req.query.deviceId;
    let deviceHashAccess = req.query.devicehashaccess;

    let logger = new Logger(true);

    if (deviceId === undefined ||
        deviceHashAccess === undefined ||
        fileNames === undefined) {
        // If not all parameters were recieved send response, and stop check synchronization
        res.end(ResponseSamples.DefaultResponse("Not all parameters were recieved", StatusCodes.NOT_ALL_PARAMETERS_WERE_RECIEVED));
        return;
    }

    try {
        // Trying to check file synchronization

        let dbWork = new DBWork();
        let device = new Device(parseInt(deviceId), deviceHashAccess, dbWork);

        device.Login();

        let fileNamesToSync = new Set();

        fileNames.forEach(fileName => {
            if (!IsFileExist(`uploads/${device.deviceData.ownerHash}/devices/${deviceId}/`, fileName, true)) fileNamesToSync.add(fileName);
        });

        fileNamesToSync = Array.from(fileNamesToSync);

        // If synchronization check succesful, send message
        res.end(ResponseSamples.ToLoggerDeviceFilesToSync(fileNamesToSync, StatusCodes.SYNC_SUCCESS));
        return;

    }
    catch (e) {
        switch (e) {
            case new DeviceHasNoOwnerError().name:
                res.end(ResponseSamples.DefaultResponse("Device has no owner", StatusCodes.DEVICE_HAS_NO_OWNER)); // Send response to client
                return;

            case new DeviceLoginDataIncorrectError().name:
                res.end(ResponseSamples.DefaultResponse("Incorrect device login data", StatusCodes.DEVICE_LOGIN_ERROR)); // Send response to client
                return;

            case new DeviceNotExistError().name:
                res.end(ResponseSamples.DefaultResponse("Device not exist, or data incorrect", StatusCodes.DEVICE_NOT_EXIST_ERROR)); // Send response to client
                return;

            default:
                logger.LogError(`Check sychronization failed : ${e.message}`);
                res.end(ResponseSamples.DefaultResponse("Synchronization check failed", StatusCodes.SYNC_CHECK_ERROR));
                return;
        }

    }
});

module.exports = router;