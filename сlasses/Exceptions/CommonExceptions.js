class NotAllParametersWereRecievedError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotAllParametersWereRecieved";
    }
}

module.exports = {NotAllParametersWereRecievedError};