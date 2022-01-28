let statusCodes = {};
const DataOnPage = {
    ShowUserInfo:(userName, devicesCount)=>{
        $(".USERNAME").text(userName);
        $(".DEVICES-COUNT").text(`Devices: ${devicesCount}`);
    }
};

// Get data to login
let userName = localStorage.getItem("userName");
let hashAccess = localStorage.getItem("hashAccess");

// If data to login not exist, redirect user to login page
if (hashAccess === null || userName === null) Redirect.ToLoginPage();

$(document).ready(() => onLoaded());

async function onLoaded() {
    $(".EXIT-ACCOUNT-BUTTON").click(() => ExitFromAccount());

    statusCodes = await Requests.StatusCodes();
    let response = {};
    let userData = {};

    try{
        response = await Requests.GetUserData(userName, hashAccess);
        userData = response.userData;
    }
    catch{
        response = {statusCode: statusCodes.ERROR_GET_USER_DATA};
    }
    
    switch(response.statusCode){
        case statusCodes.SUCCESFUL_GETTED_USER_DATA:
            DataOnPage.ShowUserInfo(userData.userName, userData.devices.length);
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

function ExitFromAccount() {
    ClearLocalStorage.LoginData();
    Redirect.ToLoginPage();
}
