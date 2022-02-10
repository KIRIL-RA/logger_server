let statusCodes = {};
const urlString = window.location.href; // URL of this page
const urlParams = new URLSearchParams(urlString.split('?')[1]); // URL parameters of this page
const
    deviceId = urlParams.get('id'),
    keys = urlParams.keys();

const DataOnPage = {
    SetUsername: (userName) => $("#USERNAME").text(userName),
    SetDeviceName: (deviceName, deviceId_) => {
        $("#MACHINE-NAME").text(deviceName);
        $(".DEVICE-NAME-BLOCK").attr("href", `/deviceinfo?id=${deviceId_}`);
    },
    SetFileData: (fileName, dateString, timeString) => {
        $("#FILE-NAME").text(fileName);
        $("#FILE-DATE").text(dateString);
        $("#FILE-TIME").text(timeString);
    },
    SetWorkData: (workTimeString, programWorkString, laserWorkString) => {
        $(".WORK-TIME-DATA").text(workTimeString);
        $(".PROGRAM-EXECUTION-TIME-DATA").text(programWorkString);
        $(".LASER-WORK-TIME-DATA").text(laserWorkString);
    }
};

$(document).ready(() => onLoaded()); // When document loaded, start main action

async function onLoaded() {
    statusCodes = await Requests.StatusCodes();

    let date = GetDateFromURL(urlString);
    let analizedData;

    try {
        await SetUsername();
        // Trying to get analized data
        analizedData = await Requests.AnalizedData(date, deviceId);
    }
    catch (e) {
        // If error catched, setting error status code
        analizedData = { statusCode: statusCodes.GET_ANALYTICS_ERROR };
    }

    switch (analizedData.statusCode) {
        case statusCodes.ANALYTICS_SUCCESFUL_SENDED:
            ShowData(analizedData);
            AnimateStopLoading();
            break;

        case statusCodes.GET_ANALYTICS_ERROR:
            // If we got error in getting analized data, redirect user to page for choise date
            Redirect.ToSelectDate();
            break;

        case statusCodes.USER_LOGIN_ERROR:
            // If user not logined, clear incorrect login data and redirect him to login page
            Redirect.ToLoginPage();
            break;

        default:
            // If we got error in getting analized data, redirect user to page for choise date
            Redirect.ToSelectDate();
            break;
    }
}

function ShowData(analizedData) {
    let result = analizedData.result;

    let date = result.date;
    let dateString = `${date.day}.${date.month}.${date.year}`;

    let time = {
        startTime: result.startTime,
        stopTime: result.stopTime
    };
    let timeString = GetTimeString(time);

    let workTime = result.logTime;
    let workTimeString = `${workTime.hours}h ${workTime.minutes}m`;

    let programWork = result.machineWork;
    let programTime = programWork.time;
    let programWorkString = `${Math.round(programWork.percent)}% - ${programTime.hours}h ${programTime.minutes}m`;

    let laserWork = result.laserWork;
    let laserTime = laserWork.time;
    let laserWorkString = `${Math.round(laserWork.percent)}% - ${laserTime.hours}h ${laserTime.minutes}m`;

    DrawGraph(result.graphPoints);
    DataOnPage.SetDeviceName(analizedData.deviceName, deviceId);
    DataOnPage.SetFileData(result.fileName, dateString, timeString);
    DataOnPage.SetWorkData(workTimeString, programWorkString, laserWorkString);
}

function AnimateStopLoading() {
    $('.LOADING').animate({ opacity: "0" }, "1");
    $('.MAIN-CONTENT').animate({ opacity: "1" }, "1");
}

/**
 * Getting string contains period of time like 00.00-23.59
 * @param {any} time Start and stop time
 * @returns String, contains time period
 */
function GetTimeString(time) {
    let sT = time.startTime.split(':');
    let startTime = `${sT[0]}:${sT[1]}`;

    let stT = time.stopTime.split(':');
    let stopTime = `${stT[0]}:${stT[1]}`;

    let finalString = `${startTime} - ${stopTime}`;
    return finalString;
}

/**
 * Getting date from URL string
 * @param {string} url 
 * @returns List, contains date
 */
function GetDateFromURL(url) {
    let urlWithoutParameters = url.split('?'); // For example from http://site/b?example=a return http://site/b/
    let urlEntries = urlWithoutParameters[0].split('//')[1].split('/'); // For example from http://site/b/ getting site/b/ and split for ['site', 'b']

    return {
        day: urlEntries[urlEntries.length - 1],
        month: urlEntries[urlEntries.length - 2],
        year: urlEntries[urlEntries.length - 3]
    };
}

function DrawGraph(graphPoints) {
    let labels = [];
    let dataset = [
        {
            label: 'Laser work',
            backgroundColor: 'rgb(11, 63, 153)',
            borderColor: 'rgb(11, 63, 153)',
            data: [],
        },
        {
            label: 'Machine work',
            backgroundColor: 'rgb(89, 153, 11)',
            borderColor: 'rgb(89, 153, 11)',
            data: [],
        }]
        ;

    graphPoints.forEach(point => {
        let time = point.time;
        let machineWorkPercent = point.machineWorkPercentOfPeriod;
        let laserWorkPercent = point.laserWorkPercentOfPeriod;

        let timeArr = time.split(':'); // Convert time string to array(for example 00:00:00:08.10.2017 to ['00', '00', '00', '08.10.2017'])
        let timePoint = `${timeArr[0]}:${timeArr[1]}`; // Make time str, contains hour and minute of point
        labels.push(timePoint);

        dataset[0].data.push(parseInt(laserWorkPercent));
        dataset[1].data.push(parseInt(machineWorkPercent));
    });

    const data = {
        labels: labels,
        datasets: dataset
    };

    const config = {
        type: 'line',
        data: data,
        options: {scales: {
            y: {
                max: 100,
                min: 0,
            }
        }}
    };

    try{
        const myChart = new Chart(
            document.getElementById('workGraph'),
            config
        );
    }
    catch{
        alert("Error draw graph");
    }
}

async function SetUsername(){
    let response = {};

    response = await Requests.GetUserData();
    userData = response.userData;
    DataOnPage.SetUsername(userData.userName);
}