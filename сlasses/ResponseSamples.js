/**
 * Samples response from server
 */
module.exports = {
    /**
     * Sample for default response
     * @param {string} message 
     * @param {number} statusCode 
     * @returns String, contains response status and status code
     */
    DefaultResponse(message, statusCode){ return `{"Status":"${message}", "statusCode":"${statusCode}"}`; } ,

    /**
     * Sample for response, contains not synchronized files to logger device
     * @param {Array} fileNames
     * @param {number} statusCode 
     * @returns String, contains response 
     */
    ToLoggerDeviceFilesToSync(fileNames, statusCode){
        let fileNamesToSend = fileNames.join(`","`);
        return `{"Not_sync_files":["${fileNamesToSend}"], "statusCode":"${statusCode}"}`;
    },

    ToUserInfoForChoose(devices, statusCode){
        let response = {
            'devices' : devices,
            'statusCode' : statusCode
        }

        return JSON.stringify(response);
    },

    ToUserAnalyticsResult(deviceData, result, statusCode){
        let response = {
            deviceName: deviceData.name,
            result: result,
            statusCode: statusCode
        };

        return JSON.stringify(response);
    },

    ToUserUserData(userData, statusCode){
        let response = {
            userData: userData,
            statusCode: statusCode
        };

        return JSON.stringify(response);
    }, 
}