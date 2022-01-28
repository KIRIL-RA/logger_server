const DAY_NAMES = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function calendar_set(year, month, clickable_dates = [], click_calendar_item){
    ClearCalendar();
    clickable_dates = new Set(clickable_dates);
    let calendarElement = document.getElementsByClassName("CLICKABLE_CALENDAR");
    let calendarRows = calendarElement[0].rows;
    let date = new Date(year, month-1);
    let monthToAdd = date.getMonth();
    let lineToFill = 0;
    let getDayName = function() {
        return (date.getDay()-1) >= 0 ? (date.getDay()-1) : 6;
    }
    
    const FIRST_DAY_IN_MONTH = getDayName();

    while(monthToAdd == date.getMonth()){
        let dayName = DAY_NAMES[getDayName()];
        let dayNumber = date.getDate();

        if(parseInt((FIRST_DAY_IN_MONTH + dayNumber - 1)/7) !== lineToFill) lineToFill++; // Transfer the filling to another line if the previous one is filled
        
        let rowToFillElements = calendarRows[lineToFill+1].children; // lineToFill + 1, because first line is header
        let elementToFill = rowToFillElements.namedItem(dayName);
        elementToFill.innerHTML = dayNumber;
        if(clickable_dates.has(dayNumber)){
             elementToFill.classList.remove("NOT_CLICKABLE");
             elementToFill.classList.add("CLICKABLE");
             elementToFill.addEventListener('click', {
                handleEvent(event) {
                    click_calendar_item(event.currentTarget);
                }});
            }

        date.setDate(++dayNumber);
    }
    
}

function ClearCalendar(){
    let calendarElement = document.getElementsByClassName("CLICKABLE_CALENDAR");
    let calendarRows = calendarElement[0].rows;
    
    for(let row = 0; row < 5; row++){
       let rowElement = calendarRows[row+1].children; 
       for(let calendarDate = 0; calendarDate < 7; calendarDate++){
           let date = rowElement[calendarDate];
           date.innerHTML = '';
           date.classList.remove("CLICKABLE");
           date.classList.add("NOT_CLICKABLE");
       }
    }
    
}