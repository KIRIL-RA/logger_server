const { UserLoginDataIncorrectError, UserNotFoundError } = require("../сlasses/Exceptions/UserExceptions");
const ResponseSamples = require("../сlasses/ResponseSamples");
const StatusCodes = require("../static/StatusCodes.json");
const DBWork = require('../сlasses/DBWork');
const User = require("../сlasses/User");
var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    let userName = req.query.username;
    let userHashAccess = req.query.hashaccess;

    if (userName === undefined ||
        userHashAccess === undefined) {
        // If not all parameters were recieved send response, and stop saving file
        res.end(ResponseSamples.DefaultResponse("Not all parameters were recieved", StatusCodes.NOT_ALL_PARAMETERS_WERE_RECIEVED));
        return;
    }

    // Check is user exist and logindata correct
    try {
        let dbWork = new DBWork();
        let user = new User(userName, userHashAccess, dbWork);

        user.Login();
        let userData = user.GetUserData();

        res.end(ResponseSamples.ToUserUserData(userData, StatusCodes.SUCCESFUL_GETTED_USER_DATA));
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
                res.end(ResponseSamples.DefaultResponse("Error get user data", StatusCodes.ERROR_GET_USER_DATA));
                return;
        }
    }
});

module.exports = router;