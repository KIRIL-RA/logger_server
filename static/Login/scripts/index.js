let statusCodes ={};
const DataOnPage = {
    ShowUnknownError: () => {
        $("#ERROR-TEXT").text("Unknown error");
        $(".ERROR").removeClass("CLOSED");
    },
    ShowIncorrectLoginData: () => {
        $("#ERROR-TEXT").text("Incorrect user name or password");
        $(".ERROR").removeClass("CLOSED");
    }
};

$(document).ready(() => onLoaded());

async function onLoaded() {
    statusCodes = await Requests.StatusCodes();

    // Get data to login
    let userName = localStorage.getItem("userName");
    let hashAccess = localStorage.getItem("hashAccess");

    // If data to login exist, check is it correct
    if (hashAccess !== null && userName !== null) await CheckIsLoginDataCorrect(userName, hashAccess);

    $("#LOGIN-BUTTON").click(() => LoginButtonClickHandler());
}

async function LoginButtonClickHandler() {
    let userName = $("#iUSERNAME").val();
    let password = $("#iPASSWORD").val();

    await CheckIsLoginDataCorrect(userName, password);
}

async function CheckIsLoginDataCorrect(userName, hashAccess) {
    let res;
    
    try {
        // Checking if user exist and login data correct
        res = await Requests.IsLoginDataCorrect(userName, hashAccess);
    }
    catch {
        res = { statusCode: statusCodes.ERROR_CHECK_USER_LOGIN_DATA };
    }

    switch (res.statusCode) {
        case statusCodes.USER_LOGIN_ERROR:
            ClearLocalStorage.LoginData();
            DataOnPage.ShowIncorrectLoginData();
            break;

        case statusCodes.ERROR_CHECK_USER_LOGIN_DATA:
            ClearLocalStorage.LoginData();
            DataOnPage.ShowUnknownError();
            break;

        case statusCodes.USER_LOGIN_SUCCESFUL:
            // If user succesful logined, redirect him to page about him
            Redirect.ToUserInfoPage();
            break;

        default:
            ClearLocalStorage.LoginData();
            DataOnPage.ShowUnknownError();
            break;
    }
}