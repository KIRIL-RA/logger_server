const { DeviceNotExistError } = require("./Exceptions/DeviceExceptions");
const { UserNotFoundError } = require("./Exceptions/UserExceptions");

let users = [{
    userHash: "a1b2c3",
    userName: "testUser",
    password: "testPassword",
    hashAccess: "aabbccdd",
    devices: [{ name: "Stanok 1-1", id: 401 }]
}];

let devices = [{
    id: 401,
    hashAccess: "aaabbb",
    ownerName: "testUser",
    ownerHash: "a1b2c3"
}];
/**
 * Access to db information.
 */
class DBWork {

    /**
     * Searching user in DB.
     * @param {string} userName 
     * @returns User data if user exist.
     */
    GetUserData(userName) {
        let userExist = false;
        let userData;

        /*    Replace for DB request     */
        users.forEach(user => {
            if (user.userName === userName) {
                userData = user;
                userExist = true;
            }
        });
        /*                               */

        if (userExist) return userData; // If user exist, return information of user.
        throw new UserNotFoundError("User not founded in DB"); // If use not exist, throw error.
    }

    /**
     * Searchin device in DB.
     * @param {number} id Device id.
     * @param Device data
     */
    GetDeviceData(id) {
        let deviceExist = false;
        let deviceData;

        /*    Replace for DB request     */
        devices.forEach(device => {
            if (device.id === id) {
                deviceData = device;
                deviceExist = true;
            }
        });
        /*                               */

        if (deviceExist) return deviceData;
        throw new DeviceNotExistError("Device not found in db");
    }

    Connect() {

    }
}

module.exports = DBWork;