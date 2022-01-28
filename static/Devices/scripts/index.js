let statusCodes = {};
const DataOnPage = {
    AddDevice: (id, name) => $('.devices-table').append(
        `<tr class="device">
        <td class="device-id">${id}</td>
        <td class="device-name">${name}</td>
        <td class="show-device-logs"><a href="/analytics/selectdate?id=${id}">Show logs</a></td>
        </tr>`),
    SetUsername: (userName) => $("#USERNAME").text(userName)
};

// Get data to login
let userName = localStorage.getItem("userName");
let hashAccess = localStorage.getItem("hashAccess");

// If data to login not exist, redirect user to login page
if (hashAccess === null || userName === null) Redirect.ToLoginPage();

$(document).ready(() => onLoaded());

async function onLoaded() {   
    DataOnPage.SetUsername(userName);

    statusCodes = await Requests.StatusCodes();
    let response = {};
    let userData = {};

    // Trying to get data about user devices
    try {
        response = await Requests.GetUserData(userName, hashAccess);
        userData = response.userData;
    }
    catch {
        // If error catched, set error status 
        response = { statusCode: statusCodes.ERROR_GET_USER_DATA };
    }

    switch (response.statusCode) {
        case statusCodes.SUCCESFUL_GETTED_USER_DATA:
            ShowDevices(userData);
            break;

        case statusCodes.USER_LOGIN_ERROR:
            // If user not logined, clear incorrect login data and redirect him to login page
            ClearLocalStorage.LoginData();
            Redirect.ToLoginPage();
            break;

        default:
            // If error unknown, say about it to user
            alert("Unknown error");
            break;
    }
}

/**
 * Show all user devices on page
 */
function ShowDevices(userData) {
    let devices = userData.devices;

    devices.forEach(device => DataOnPage.AddDevice(device.id, device.name));
}