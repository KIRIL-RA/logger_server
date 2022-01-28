var { GetDirectories, GetFiles } = require('./File');
const { NotAllParametersWereRecievedError } = require("./Exceptions/CommonExceptions");
var { ReadFileAsLines } = require("./File");
const { cookie } = require('express/lib/response');

class Logic {
    /**
     * Getting logs of specified device
     * @param {string} userHash 
     * @param {number} deviceId 
     * @returns List of logs, sorted on dates
     */
    static GetExistLogs(userHash, deviceId) {
        let existLogs = {};
        let years = GetDirectories(`uploads/${userHash}/devices/${deviceId}/`);

        years.forEach(year => {
            existLogs[year] = {};
            let months = GetDirectories(`uploads/${userHash}/devices/${deviceId}/${year}/`);
            months.forEach(month => {
                let dates = GetFiles(`uploads/${userHash}/devices/${deviceId}/${year}/${month}/`);
                existLogs[year][month] = dates;
            });
        });

        return existLogs;
    }

    static async GetAnalytics(userHash, deviceId, date) {
        let makeGraphPoints = 30; // Make graph control points every 30 minutes of log
        let year = date.year;
        let month = date.month;
        let day = date.day;

        if (userHash === undefined ||
            deviceId === undefined ||
            year === undefined ||
            month === undefined ||
            day === undefined) throw new NotAllParametersWereRecievedError("You must specify all parameters");

        if (userHash === null ||
            deviceId === null ||
            year === null ||
            month === null ||
            day === null) throw new NotAllParametersWereRecievedError("You must specify all parameters");

        let CloneObject = (fromArray, toArray) =>{
            for(let key in fromArray) toArray[key] = fromArray[key];
        };

        let wholeLines =[];
        let graphPoints = [];
        let analizedData = {
            correctWrites: 0,
            machineWorkRecords: 0,
            laserWorkRecords: 0
        }
        let lastGraphPointData = {};
        CloneObject(analizedData, lastGraphPointData);
        makeGraphPoints = makeGraphPoints * 60;

        await ReadFileAsLines(`uploads/${userHash}/devices/${deviceId}/${year}/${month}/${day}.csv`, line => {
            // Parse line
            let parameters = line.split(', ');

            // If line not contains 3 parameters, consider line corrupted
            if (parameters.length !== 3) return;

            let time = parameters[0];
            let machineState = parameters[1];
            let laserState = parameters[2];

            if (parseInt(machineState) === 1) analizedData.machineWorkRecords++;
            if (parseInt(laserState) === 1) analizedData.laserWorkRecords++;
            analizedData.correctWrites++;
            wholeLines.push({
                time: time,
                machineState: machineState,
                laserState: laserState
            });

            if ((analizedData.correctWrites - 1) % makeGraphPoints === 0) {
                //if you need to make a point on the chart, we do analytics for the chart

                // Not analized period
                let notAnalizedPeriod = {
                    correctWrites: analizedData.correctWrites - lastGraphPointData.correctWrites,
                    machineWorkRecords: analizedData.machineWorkRecords - lastGraphPointData.machineWorkRecords,
                    laserWorkRecords: analizedData.laserWorkRecords - lastGraphPointData.laserWorkRecords
                }
                
                CloneObject(analizedData, lastGraphPointData);

                // Calculate and save points
                graphPoints.push({
                    time: time,
                    machineWorkPercentOfPeriod: (notAnalizedPeriod.machineWorkRecords / notAnalizedPeriod.correctWrites) * 100,
                    laserWorkPercentOfPeriod: (notAnalizedPeriod.laserWorkRecords / notAnalizedPeriod.correctWrites) * 100
                });
            }
        });

        let logTime = Logic.SecondsToHMS(analizedData.correctWrites);

        let result = {
            fileName: `${day}.csv`,
            date: date,
            startTime: wholeLines[0].time,
            stopTime: wholeLines[wholeLines.length-1].time,
            logTime: logTime,
            machineWork:{
                percent: (analizedData.machineWorkRecords / analizedData.correctWrites) * 100,
                time: Logic.SecondsToHMS(analizedData.machineWorkRecords)
            },
            laserWork:{
                percent: (analizedData.laserWorkRecords / analizedData.correctWrites) * 100,
                time: Logic.SecondsToHMS(analizedData.laserWorkRecords)
            },
            graphPoints: graphPoints
        }
        
        return result;
    }

    /**
     * Convert seconds to hours, seconds and minutes
     * @param {number} seconds 
     * @returns List, contains hours, minutes and seconds information
     */
    static SecondsToHMS(seconds) {
        let h = Math.floor(seconds / 3600);
        let m = Math.floor(seconds % 3600 / 60);
        let s = Math.floor(seconds % 3600 % 60);

        return { hours: h, minutes: m, seconds: s };
    }

}

module.exports = Logic;