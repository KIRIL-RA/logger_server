const { DeviceNotExistError } = require("./Exceptions/DeviceExceptions");
const { UserNotFoundError } = require("./Exceptions/UserExceptions");
const { NotAllParametersWereRecievedError } = require("./Exceptions/CommonExceptions");
const MongoClient = require("mongodb").MongoClient;

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

    /**
     * Adding user session token to data base
     * @param {String} userHash 
     * @param {String} sessionToken 
     */
    async AddNewUserSession(userHash, sessionToken) {
        if ((userHash == undefined || sessionToken == undefined) || (userHash == undefined || sessionToken == undefined)) throw new NotAllParametersWereRecievedError("Not all parameters were recieved"); // Check,  is all parameters were recieved

        const datataBase = this.mongoClient.db("LCA");
        const collection = datataBase.collection("USERS");
        await collection.updateOne({ userHash: userHash }, {$push: { activeSessions: sessionToken}});
    }

    /**
     * Adding short analytic result to data base
     * @param {number} deviceId 
     * @param {String} userHash 
     * @param {any} result 
     */
    async AddFileAnalytics(deviceId, userHash, result){
        if((deviceId === undefined || userHash === userHash || result === undefined)||(deviceId === null || userHash === null || result === null)) throw new NotAllParametersWereRecievedError("Not all parameters were recieved");

        const datataBase = this.mongoClient.db("LCA");
        const collection = datataBase.collection("LIGHT_ANALYTICS_RESULT");
        await collection.insertOne({deviceId: deviceId, userHash: userHash, resilt: result});
    }

    /**
     * Change user device name
     * @param {String} userHash 
     * @param {number} deviceId 
     * @param {String} deviceName 
     */
    async RenameDevice(userHash, deviceId, deviceName){
        if((deviceId === undefined || userHash === undefined || deviceName === undefined)||(deviceId === null || userHash === null || deviceName === null)) throw new NotAllParametersWereRecievedError("Not all parameters were recieved");

        // Searching user in data base
        const datataBase = this.mongoClient.db("LCA");
        const collection = datataBase.collection("USERS");
        let userData = await collection.findOne({ userHash: userHash, devices:{$elemMatch:  {id: deviceId}} });
        let devices = userData.devices;

        // Searching device in array
        let deviceNumber;
        for(let device = 0; device < devices.length; device++) if(devices[device].id == deviceId) deviceNumber = device; 

        // Rename device
        let toUpdate = {};
        toUpdate[`devices.${String(deviceNumber)}.name`] = deviceName;
        await collection.updateOne({ userHash: userHash}, {$set: toUpdate});
    }

    /**
     * Searching device in DB.
     * @param {number} id Device id.
     * @param Device data
     */
    async GetDeviceData(searchParameters) {
        let deviceExist = false;
        let deviceData;

        const datataBase = this.mongoClient.db("LCA");
        const collection = datataBase.collection("DEVICES");
        const results = await collection.find(searchParameters).toArray();
        if (results.length != 0) {
            deviceExist = true;
            deviceData = results[0];
        }

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