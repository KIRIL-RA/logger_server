var { SaveFilesFromRequest } = require("../сlasses/File");
var express = require('express');
var multer = require('multer');
const DBWork = require('../сlasses/DBWork');
const Logger = require('../сlasses/Logger');
const Device = require('../сlasses/Device');
const ResponseSamples = require("../сlasses/ResponseSamples");
const { DeviceLoginDataIncorrectError, DeviceNotExistError, DeviceHasNoOwnerError  } = require("../сlasses/Exceptions/DeviceExceptions");

const StatusCodes = require("../static/StatusCodes.json");

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/buffer/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
}); // Storage config for multer

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "text/csv") cb(null, true);
    else cb(null, false);
} // File filter for multer

var router = express.Router();
var upload = multer({ storage: storageConfig, fileFilter: fileFilter })

/**
 * Receiving post requests with files.
 */
router.post('/', upload.array('avatar'), function (req, res, next) {
    let files = req.files;
    let deviceId = req.query.deviceId;
    let deviceHashAccess = req.query.devicehashaccess;

    let logger = new Logger(true);

    if ( deviceId === undefined ||
        deviceHashAccess === undefined) {
        // If not all parameters were recieved send response, and stop saving file
        res.end(ResponseSamples.DefaultResponse("Not all parameters were recieved", StatusCodes.NOT_ALL_PARAMETERS_WERE_RECIEVED));
        return;
    }

    if (files === undefined || files.length === 0) {
        // If files not recieved send response, and stop saving file
        res.end(ResponseSamples.DefaultResponse("File recieve error", StatusCodes.FILE_RECIEVE_ERROR));
        return;
    }

    try {
        // Trying to save uploaded file

        let dbWork = new DBWork();
        let device = new Device(parseInt(deviceId), deviceHashAccess, dbWork);

        device.Login();
        SaveFilesFromRequest(`uploads/${device.deviceData.ownerHash}/devices/${deviceId}/`, files, true);

        // If saving succesful send message about succesful saving
        logger.LogSucces(`Files succesful recieved and saved. User: ${device.deviceData.ownerName}, deviceid: ${deviceId}`);
        res.end(ResponseSamples.DefaultResponse('Files succesful recieved and save', StatusCodes.FILE_RECIEVED_AND_SAVED_SUCCESFUL)); // Send response to client
        return;
    }
    catch (e) {
        switch (e.name) {
            case new DeviceHasNoOwnerError().name:
                res.end(ResponseSamples.DefaultResponse("Device has no owner", StatusCodes.DEVICE_HAS_NO_OWNER)); // Send response to client
                return;

            case new DeviceLoginDataIncorrectError().name:
                res.end(ResponseSamples.DefaultResponse("Incorrect login data", StatusCodes.DEVICE_LOGIN_ERROR)); // Send response to client
                return;

            case new DeviceNotExistError().name:
                res.end(ResponseSamples.DefaultResponse("Device not exist, or data incorrect", StatusCodes.DEVICE_NOT_EXIST_ERROR)); // Send response to client
                return;

            default:
                logger.LogError(`Saving files error : ${e.message}. \ndeviceid: ${deviceId}`);
                res.end(ResponseSamples.DefaultResponse("Saving files error", StatusCodes.FILE_SAVE_ERROR)); // Send response to client
                return;
        }

    }

});

module.exports = router;