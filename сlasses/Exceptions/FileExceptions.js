class FileNotExistError extends Error{
    constructor(message){
        super(message);
        this.name = 'FileNotExist';
    }
}

module.exports = {FileNotExistError};