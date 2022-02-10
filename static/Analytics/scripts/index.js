const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DataOnPage = {
    AddDevice: (id, name) => $('#select-devices').append(`<option value="${id}">${id}: ${name}</option>`),
    AddYear: (year) => $('#select-year').append(`<option value="${year}">${year}</option>`),
    AddMonth: (month) => $('#select-month').append(`<option value="${month}">${MONTHS[month - 1]}</option>`),
    SetUsername: (userName) => $("#USERNAME").text(userName)
};

let statusCodes = {};
let devices = {};

$(document).ready(() => onLoaded());

async function onLoaded() {
    let response = {};

    $('select').change(() => DataChanged());

    statusCodes = await Requests.StatusCodes();

    try {
        response = await Requests.GetDataForSelect();
        devices = response.devices;
    }
    catch {
        response = { statusCode: statusCodes.ERROR_GET_USER_DATA };
    }

    switch (response.statusCode) {
        case statusCodes.SUCCESFUL_SENDED_INFO_FO_CHOOSE:
            FillSelect(devices);
            DataChanged();
            break;

        case statusCodes.USER_LOGIN_ERROR:
            // If user not logined, clear incorrect login data and redirect him to login page
            Redirect.ToLoginPage();
            break;

        default:
            // If error unknown, say about it to user
            alert("Unknown error");
            break;
    }
    
    await SetUsername();
}

function FillSelect(devices) {
    devices.forEach(device => {
        let name = device.name;
        let id = device.id;
        let logs = device.logs;

        DataOnPage.AddDevice(id, name);

        for (let yearOfLog in logs) {
            let months = logs[yearOfLog];
            DataOnPage.AddYear(yearOfLog);

            for (let month in months) {
                let dates = months[month];
                DataOnPage.AddMonth(month);
            }
        }
    });
}

function GetDates(devices, deviceId, year, month) {
    let logsReturn = [];
    devices.forEach(device => {

        let id = parseInt(device.id);
        let logs = device.logs;

        if (id == deviceId)

            for (let yearOfLog in logs) {
                let months = logs[yearOfLog];
                if (yearOfLog == year)
                    for (let monthOfLog in months)
                        if (monthOfLog == month) logsReturn = months[monthOfLog];}
            
    });

    return logsReturn;
}

function DataChanged() {
    let deviceId = $('#select-devices').val();
    let year = $('#select-year').val();
    let month = $('#select-month').val();

    let availableDatesStrings = GetDates(devices, parseInt(deviceId), parseInt(year), parseInt(month));
    let availableDates = [];

    availableDatesStrings.forEach(date => availableDates.push(parseInt(date.split('.')[0]))); // We got dates not foramted, like 20.csv. We transform raw date to number date
    calendar_set(parseInt(year), parseInt(month), availableDates, clickedElement => CalendarClickedItem(clickedElement.innerHTML));
}

function CalendarClickedItem(day){
    let deviceId = $('#select-devices').val();
    let year = $('#select-year').val();
    let month = $('#select-month').val();
    day = parseInt(day);

    Redirect.ToShowAnalytics(year, month, day, deviceId);
}

async function SetUsername(){
    let response = {};

    response = await Requests.GetUserData();
    userData = response.userData;
    DataOnPage.SetUsername(userData.userName);
}