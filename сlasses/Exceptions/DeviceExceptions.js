class DeviceLoginDataIncorrectError extends Error{
    constructor(message){
        super(message);
        this.name = "DeviceLoginDataIncorrect";
    }
}

class DeviceNotExistError extends Error{
    constructor(message){
        super(message);
        this.name = "DeviceNotExist";
    }
}

class DeviceNotLoginedError extends Error{
    constructor(message){
        super(message);
        this.name = "DeviceNotLogined";
    }
}

class DeviceHasNoOwnerError extends Error{
    constructor(message){
        super(message);
        this.name = "DeviceHasNoOwner";
    }
} 

module.exports = {DeviceNotExistError, DeviceLoginDataIncorrectError, DeviceHasNoOwnerError, DeviceNotLoginedError};