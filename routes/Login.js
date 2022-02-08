const { UserLoginDataIncorrectError, UserNotFoundError } = require("../сlasses/Exceptions/UserExceptions");
const ResponseSamples = require("../сlasses/ResponseSamples");
const StatusCodes = require("../static/StatusCodes.json");
const { DBWork, LCADatabase } = require('../сlasses/DBWork');
const { UserWithPassword } = require("../сlasses/User");
var express = require('express');
var router = express.Router();

router.get('/', async function (req, res, next) {
    let userName = req.query.username;
    let userPassword = req.query.password;

    if (userName === undefined ||
        userPassword === undefined) {
        // If not all parameters were recieved send response, and stop saving file
        res.end(ResponseSamples.DefaultResponse("Not all parameters were recieved", StatusCodes.NOT_ALL_PARAMETERS_WERE_RECIEVED));
        return;
    }

    // Check is user exist and login data correct
    try {
        // Connecting to DB and create user copy
        await LCADatabase.Connect();
        let user = new UserWithPassword(userName, userPassword, LCADatabase);

        await user.Login();
        await user.CreateNewSession();

        await LCADatabase.CloseConnection();

        let userData = user.GetUserData();
        
        res.cookie('sessionToken', userData.sessionToken, { maxAge: 900000, httpOnly: true });
        res.cookie('userHash', userData.userHash, { maxAge: 900000, httpOnly: true });
        res.end(ResponseSamples.DefaultResponse("Sucessfully logined", StatusCodes.USER_LOGINED_SUCCESSFUL_WITH_PASSWORD));
        return;
    }

    // Catching errors
    catch (e) {
        switch (e.name) {
            case new UserNotFoundError().name:
                res.end(ResponseSamples.DefaultResponse("Incorrect user login data", StatusCodes.USER_LOGIN_ERROR));
                return

            case new UserLoginDataIncorrectError().name:
                res.end(ResponseSamples.DefaultResponse("Incorrect user login data", StatusCodes.USER_LOGIN_ERROR));
                return;

            default:
                res.end(ResponseSamples.DefaultResponse("Error check login data", StatusCodes.ERROR_CHECK_USER_LOGIN_DATA));
                return;
        }
    }
});

module.exports = router;