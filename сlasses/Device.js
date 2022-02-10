const { NotAllParametersWereRecievedError } = require("./Exceptions/CommonExceptions");
const DBWork = require("./DBWork");
const { DeviceLoginDataIncorrectError, DeviceNotExistError, DeviceNotLoginedError, DeviceHasNoOwnerError } = require("./Exceptions/DeviceExceptions");

class Device{
    /**
     * Actions with device
     * @param {number} id 
     * @param {string} hashAccess 
     * @param {DBWork} dbWork 
     */
    constructor(id, hashAccess, dbWork){
        if(id === undefined || hashAccess === undefined || dbWork === undefined) throw new NotAllParametersWereRecievedError("You must specify all parameters");
        if(id === null || hashAccess === null || dbWork === null) throw new NotAllParametersWereRecievedError("You must specify all parameters");
        
        this.deviceData = {
            id: id,
            hashAccess: hashAccess
        }
        this.dbWork = dbWork;
        this.isDeviceLogined = false;
    }

    /**
     * Check is device has owner
     */
    CheckDeviceHasOwner(){
        if(!this.isDeviceLogined) throw new DeviceNotLoginedError("Device not logined");
        if(this.deviceData.ownerHash === undefined || this.deviceData.ownerHash === null) return false;
        return true;
    }

    /**
     * Check login data.
     */
    async Login(){
        let dbWork = this.dbWork;
        try{
            let deviceData = await dbWork.GetDeviceData({id: this.deviceData.id});
            if(deviceData.id !== this.deviceData.id || deviceData.hashAccess !== this.deviceData.hashAccess) throw new DeviceLoginDataIncorrectError("Device login data error");
            this.deviceData = deviceData;
            this.isDeviceLogined = true;
            if(!this.CheckDeviceHasOwner()) throw new DeviceHasNoOwnerError("Owner not found");
        }
        catch(e){
            switch(e){
                case new DeviceNotExistError().name:
                    throw new DeviceNotExistError("Device not exist");
                    
                case new DeviceLoginDataIncorrectError().name:
                    throw new DeviceLoginDataIncorrectError("Device login data error");

                default:
                    throw "Device login error";
            }
        }
    }
}

module.exports = Device;