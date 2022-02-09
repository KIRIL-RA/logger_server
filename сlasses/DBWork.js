const { DeviceNotExistError } = require("./Exceptions/DeviceExceptions");
const { UserNotFoundError } = require("./Exceptions/UserExceptions");
const { NotAllParametersWereRecievedError } = require("./Exceptions/CommonExceptions");
const MongoClient = require("mongodb").MongoClient;

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
    constructor(url) {
        this.mongoClient = new MongoClient(url);
    }

    /**
     * Searching user in DB.
     * @param {any} searchParameters 
     * @returns User data if user exist.
     */
    async GetUserData(searchParameters) {
        let userExist = false;
        let userData;

        const datataBase = this.mongoClient.db("LCA");
        const collection = datataBase.collection("USERS");
        const results = await collection.find(searchParameters).toArray();
        if (results.length != 0) {
            userExist = true;
            userData = results[0];
        }

        if (userExist) return userData; // If user exist, return information of user.
        throw new UserNotFoundError("User not founded in DB"); // If use not exist, throw error.
    }

    async AddNewUserSession(userHash, sessionToken) {
        if ((userHash == undefined || sessionToken == undefined) || (userHash == undefined || sessionToken == undefined)) throw new NotAllParametersWereRecievedError("Not all parameters were recieved"); // Check,  is all parameters were recieved

        const datataBase = this.mongoClient.db("LCA");
        const collection = datataBase.collection("USERS");
        await collection.updateOne({ userHash: userHash }, {$push: { activeSessions: sessionToken}});
    }

    /**
     * Searching user in DB.
     * @param {string} userName 
     * @returns User data if user exist.
     */
    GetUserDataDB(userName) {
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

    /**
     * Open connection to database
     */
    async Connect() {
        await this.mongoClient.connect();
    }

    /**
     * Close connection ro database
     */
    async CloseConnection() {
        await this.mongoClient.close();
    }
}

const LCADatabase = new DBWork("mongodb://localhost:27017/");

module.exports = { LCADatabase: LCADatabase, DBWork };