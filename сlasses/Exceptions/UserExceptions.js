  class UserNotFoundError extends Error{
    constructor(message){
        super(message);
        this.name = "UserNotFound";
    }
  }

class UserLoginDataIncorrectError extends Error {
    constructor(message) {
        super(message);
        this.name = "UserLoginDataIncorrect";
    }
}

class UserNotLoginedError extends Error {
    constructor(message) {
        super(message);
        this.name = "UserNotLogined";
    }
}

class UserHasNoDevicesError extends Error{
    constructor(message){
        super(message);
        this.name = "UserHasNoDevices";
    }
};

module.exports = {UserNotFoundError, UserLoginDataIncorrectError, UserNotLoginedError, UserHasNoDevicesError};