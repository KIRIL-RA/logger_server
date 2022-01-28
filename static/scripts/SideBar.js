const urlString_ = window.location.href; // URL of this page
const urlParams_ = new URLSearchParams(urlString_.split('?')[1]); // URL parameters of this page

const Sidenav = {
    SetOnAboutUserPage: () => $(".aboutuser").removeClass("defaultsidenavnavigation").addClass("onthispage"),
    SetOnDevicesPage: () => $(".devices").removeClass("defaultsidenavnavigation").addClass("onthispage"),
    SetOnAnalyticsPage: () => $(".selectdate").removeClass("defaultsidenavnavigation").addClass("onthispage"),
    Open: () => $(".sidenav").css("width", "100vw"),
    Close: () => $(".sidenav").css("width", "0vw")
}

$(".sidenav").ready(() => onLoadedSidebar());

async function onLoadedSidebar() {
    // Getting url entries in order to understand which page we are on
    let urlWithoutParameters_ = urlString_.split('?'); // For example from http://site/b?example=a return http://site/b/
    let urlEntries_ = urlWithoutParameters_[0].split('//')[1].split('/'); // For example from http://site/b/ getting site/b/ and split for ['site', 'b']
    $(".closebtn").click(() => { Sidenav.Close() });
    $(".OPEN-MENU-BUTTON").click(() => { Sidenav.Open() });

    switch (urlEntries_[1]) {
        case 'aboutuser':
            Sidenav.SetOnAboutUserPage();
            break;

        case 'devices':
            Sidenav.SetOnDevicesPage();
            break;

        case 'analytics':
            Sidenav.SetOnAnalyticsPage();
            break;
    }
}