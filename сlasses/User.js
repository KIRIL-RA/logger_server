const { NotAllParametersWereRecievedError } = require("./Exceptions/CommonExceptions");
const { UserLoginDataIncorrectError, UserNotFoundError, UserNotLoginedError, UserHasNoDevicesError } = require("./Exceptions/UserExceptions");
const DBWork = require("./DBWork");
const { DeviceNotExistError } = require("./Exceptions/DeviceExceptions");

class User {

    /**
     * Actions with user. Contains infromations of user, function for work with user.
     * @param {string} userName 
     * @param {string} hashAccess 
     * @param {DBWork} dbWork
     */
    constructor(userName, hashAccess, dbWork) {
        if (userName === undefined || hashAccess === undefined || dbWork === undefined) throw new NotAllParametersWereRecievedError("You must specify all parameters");
        if (userName === null || hashAccess === null || dbWork === null) throw new NotAllParametersWereRecievedError("You must specify all parameters");

        this.userData = {
            userName: userName,
            hashAccess: hashAccess,
        }
        this.dbWork = dbWork;
        this.isUserLogined = false;
    }

    /**
     * Loggining user.
     * Throw UserLoginDataIncorrectError if login failed, beause entered data incorrect.
     * Throw TypeError if login incorrect for other reasons.
     */
    Login() {
        let dbWork = this.dbWork;
        try {
            let userData = dbWork.GetUserData(this.userData.userName);
            if (userData.userName !== this.userData.userName || userData.hashAccess !== this.userData.hashAccess) throw new UserLoginDataIncorrectError("User login failed, data incorrected");
            this.userData = userData;
            this.isUserLogined = true;

            return userData;
        }
        catch (e) {
            switch (e.name) {
                case new UserNotFoundError().name:
                    throw new UserLoginDataIncorrectError("User not found");

                case new UserLoginDataIncorrectError().name:
                    throw new UserLoginDataIncorrectError("User login failed, data incorrected");

                default:
                    throw "User login failed, uncaught error";
            }
        }
    }

    /**
     * Get info about device
     * @param {number} deviceId 
     * @returns deviceData
     */
    GetDeviceData(deviceId){
        if(!this.isUserLogined) throw new UserNotLoginedError("User no logined");
        let devices = this.userData.devices;
        let deviceData;

        // Check, is user has any devices
        if(devices.length == 0 || devices === undefined || devices === null) throw new UserHasNoDevicesError("User has no devices");

        // Finding device by id
        devices.forEach(device =>{
            if(device.id === deviceId) deviceData = device;
        });

        if(deviceData !== undefined) return deviceData;

        // If device not found in user devices, throw exception
        throw new DeviceNotExistError("Device not exist, or not belongs to user");
    }

    /**
     * Getting info about user
     * @returns List contains userdata
     */
    GetUserData(){
        if(!this.isUserLogined) throw new UserNotLoginedError("User no logined");

        let CloneObject = (fromArray, toArray) =>{
            for(let key in fromArray) toArray[key] = fromArray[key];
        };

        let userData = {};
        CloneObject(this.userData, userData);

        delete userData.hashAccess;
        delete userData.password;

        return userData;
    }
}

module.exports = User;