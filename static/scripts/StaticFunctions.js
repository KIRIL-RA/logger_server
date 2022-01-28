const ClearLocalStorage = {
    LoginData: () => {
        localStorage.clear("userName");
        localStorage.clear("hashAccess");
    }
};

// Redirect to other pages
const Redirect = {
    ToLoginPage: () => document.location.href = "/login",
    ToSelectDate: () => document.location.href = "/analytics/selectdate",
    ToUserInfoPage: () => document.location.href = "/aboutuser",
    ToShowAnalytics: (year, month, day, id) => document.location.href = `/showanalytics/${year}/${month}/${day}?id=${id}`
};

// Request samples
const Requests = {
    AnalizedData: async (date, userName, hashAccess, deviceId) =>
        fetch(`/getanalytics/${date.year}/${date.month}/${date.day}?username=${userName}&hashaccess=${hashAccess}&deviceid=${deviceId}`).then(response => response.ok ? response.json() : (() => { throw "Error parse response"; })()),

    StatusCodes: async () =>
        fetch("/StatusCodes.json").then(response => response.ok ? response.json() : (() => { throw "Error parse response"; })()),

    IsLoginDataCorrect: async (userName, hashAccess) =>
        fetch(`/isuserlogindatacorrect?username=${userName}&hashaccess=${hashAccess}`).then(response => response.ok ? response.json() : (() => { throw "Error parse response"; })()),

    GetUserData: async (userName, hashAccess) =>
        fetch(`/getuserinfo?username=${userName}&hashaccess=${hashAccess}`).then(response => response.ok ? response.json() : (() => { throw "Error parse response"; })()),

    GetDataForSelect: async (userName, hashAccess) =>
        fetch(`/getinfochoise?username=${userName}&hashaccess=${hashAccess}`).then(response => response.ok ? response.json() : (() => { throw "Error parse response"; })())
};
