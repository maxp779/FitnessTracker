/**
 * 
 * @param {type} callback
 * @returns {undefined}
 */
function setupEvents(callback)
{
    //create macro datepicker
    $('#foodDatePicker').datepicker({
        autoclose: true,
        todayBtn: "linked",
        format: "dd/mm/yyyy"
    });

    //get currently viewed date from localStorage, or todays date if no date is found
    var currentlyStoredDate = fitnessTrackerGlobals.commonFunctions.getCurrentlyViewedDate();
    $('#foodDatePicker').datepicker('setDate', currentlyStoredDate);
    $('#foodDatePicker').datepicker('update');

    $('#foodDatePicker').datepicker().on('changeDate', function () {
        var currentlyViewedDate = $('#foodDatePicker').datepicker('getUTCDate');
        fitnessTrackerGlobals.commonFunctions.setCurrentlyViewedDate(currentlyViewedDate);
        fitnessTrackerGlobals.ajaxFunctions.getEatenFoodList(currentlyViewedDate, function ()
        {
            updateFoodLogPage();
        });
    });

    //listener for adding food manually
    //.submit is used because the button is attached to a form
    $("#addEatenFoodForm").submit(function (event) {
        console.log("add food manually button triggered");
        event.preventDefault(); //this prevents the default actions of the form
        addEatenFoodManually(function () {
            fitnessTrackerGlobals.ajaxFunctions.getEatenFoodList(function () {
                updateFoodLogPage();
            });
        });
    });

    //listener for remove food buttons on food eaten table
    $(document).on("click", ".removeFoodButton", function () {
        console.log("remove eaten food button triggered");
        var clickedElement = this;
        var foodUuid = clickedElement.dataset.foodUuid;
        console.log("foodUuid " + foodUuid + " selected for removal");
        removeEatenFood(foodUuid);
    });

    //listener to add a food to eaten foods from the custom foods list
    $(document).on("click", ".eatenCustomFoodButton", function () {
        var clickedElement = this;
        var foodUuid = clickedElement.dataset.foodUuid;
        console.log("foodUuid: " + foodUuid + " custom food will be added");
        addCustomFood(foodUuid);
    });


    //listener to add a food to eaten foods from the search result list
    $(document).on("click", ".eatenSearchResultButton", function () {
        var clickedElement = this;
        var foodUuid = clickedElement.dataset.foodUuid;
        console.log("foodUuid: " + foodUuid + " food will be added");
        addEatenFoodFromSearchResult(foodUuid);
    });

    //listener to respond to searchButton click for searching the database
    $(document).on("click", "#searchButton", function () {
        var searchInput = document.getElementById("searchInput").value;
        console.log("searching for " + searchInput);
        searchForFood(searchInput);
    });

    //listener to respond to "enter" keypress for searching the database
    $("#searchInput").keypress(function (event) {
        if (event.which === 13)
        {
            var searchInput = document.getElementById("searchInput").value;
            console.log("searching for " + searchInput);
            searchForFood(searchInput);
        }
    });


    //listener for datepicker increment date buttons
    $(document).on("click", "#incrementFoodDateButton", function (e) {
        incrementDate();
    });

    //listener for datepicker decrement date buttons
    $(document).on("click", "#decrementFoodDateButton", function (e) {
        decrementDate();
    });

    $(document).on("click", ".incrementWeightButton", function (e) {
        e.stopPropagation(); //stops the triggering of all parent events
        var clickedElement = this;
        var foodUuid = clickedElement.dataset.foodUuid;
        var elementId = foodUuid+"-weightinput";
        var weightInput = document.getElementById(elementId);
        weightInput.stepUp();
        var newWeight = weightInput.value;

        updateSearchResultMacros(foodUuid,newWeight);
    });

    $(document).on("click", ".decrementWeightButton", function (e) {
        e.stopPropagation(); //stops the triggering of all parent events
        var clickedElement = this;
        var foodUuid = clickedElement.dataset.foodUuid;
        var elementId = foodUuid+"-weightinput";
        var weightInput = document.getElementById(elementId);
        weightInput.stepDown();
        var newWeight = weightInput.value;

        updateSearchResultMacros(foodUuid,newWeight);
    });

    //listener for datepicker decrement date buttons
    $(document).on("click", ".searchResultWeightInput", function (e) {
        e.stopPropagation(); //stops the triggering of all parent events
    });

    //listener for when the user changes the weight of a search result from the database
    $(document).on("change", ".searchResultWeightInput", function (e) {
        e.stopPropagation(); //stops the triggering of all parent events
        var changedElement = this;
        var foodUuid = changedElement.dataset.foodUuid;
        var newWeight = changedElement.value;
        console.log("search result weight change detected for input field: " + foodUuid);
        updateSearchResultMacros(foodUuid, newWeight);
    });

    //auto selects form input text when clicked
    $(document).on('click', 'input', function () {
        this.select();
    });

    if (callback)
    {
        callback();
    }
}

function incrementDate()
{
    console.log("incrementDate()");
    var currentlyViewedDate = fitnessTrackerGlobals.commonFunctions.getCurrentlyViewedDate();
    currentlyViewedDate.setDate(currentlyViewedDate.getDate() + 1);
    fitnessTrackerGlobals.commonFunctions.setCurrentlyViewedDate(currentlyViewedDate);
    $('#foodDatePicker').datepicker('setDate', currentlyViewedDate);
}
function decrementDate()
{
    console.log("decrementDate()");
    var currentlyViewedDate = fitnessTrackerGlobals.commonFunctions.getCurrentlyViewedDate();
    currentlyViewedDate.setDate(currentlyViewedDate.getDate() - 1);
    fitnessTrackerGlobals.commonFunctions.setCurrentlyViewedDate(currentlyViewedDate);
    $('#foodDatePicker').datepicker('setDate', currentlyViewedDate);
}