/**
 * This method gets the date that the user has selected with the datepicker and returns it in Unix time
 * format.
 * @returns {Number}
 */
//function getSelectedUNIXdate()
//{
//    var currentDate = new Date();
//    var selectedDate = $('#macroDatepicker').datepicker('getUTCDate');
//
//
//    var currentDateUtcUnix = Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(),
//            currentDate.getUTCDate(), currentDate.getUTCHours(), currentDate.getUTCMinutes(), currentDate.getUTCSeconds());
//    var selectedDateUnix = Math.floor(selectedDate.getTime() / 1000); // we need /1000 to get seconds, otherwise milliseconds is returned
//    var startOfCurrentDateUnix = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
//
//    //if a date in the future or past i.e. tomorrow or yesterday is selected then
//    //that will be used as the foods timestamp, otherwise todays date and time will
//    //be used. This allows the user to modify a previous days food log or plan ahead
//    //and modify a future dates food log.
//    if (selectedDateUnix > currentDateUtcUnix || selectedDateUnix < startOfCurrentDateUnix)
//    {
//        return selectedDateUnix;
//    } else
//    {
//        return currentDateUtcUnix;
//    }
//}
