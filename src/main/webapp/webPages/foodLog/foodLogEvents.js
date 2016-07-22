/**
 * 
 * @param {type} callback
 * @returns {undefined}
 */
function setupEvents(callback)
{
//    if(globalFunctions.isUndefinedOrNull(globalValues.miscValues.currentlyViewedDate))
//    {
//        globalValues.miscValues.currentlyViewedDate = new Date();
//    }

    //create macro datepicker
    $('#foodDatePicker').datepicker({
        autoclose: true,
        todayBtn: "linked",
        format: "dd/mm/yyyy"
    });

    //ensure todays date is shown in the datepickers textbox initially
//    $('#foodDatePicker').datepicker('setDate', globalValues.miscValues.currentlyViewedDate);
//    $('#foodDatePicker').datepicker('update');
//
//    $('#foodDatePicker').datepicker().on('changeDate', function () {
//        globalValues.miscValues.currentlyViewedDate = $('#foodDatePicker').datepicker('getDate');
//        globalFunctionsAjax.getEatenFoodList(globalValues.miscValues.currentlyViewedDate, function ()
//        {
//            updateFoodLogPage();
//        });
//    });

    var currentlyStoredDate = globalFunctions.getCurrentlyViewedDate();
    $('#foodDatePicker').datepicker('setDate', currentlyStoredDate);
    $('#foodDatePicker').datepicker('update');
    
    $('#foodDatePicker').datepicker().on('changeDate', function () {
        var currentlyViewedDate = $('#foodDatePicker').datepicker('getUTCDate');
        globalFunctions.setCurrentlyViewedDate(currentlyViewedDate);
        globalFunctionsAjax.getEatenFoodList(currentlyViewedDate, function ()
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

            globalFunctionsAjax.getEatenFoodList(function () {
                updateFoodLogPage();
            });
        });
    });

    //listener for remove food buttons on food eaten table
    $(document).on("click", ".btn-danger", function () {
        console.log("remove button triggered");
        var id_eatenfood = $(this).attr("id");
        console.log("id_eatenfood " + id_eatenfood + " selected for removal");
        id_eatenfood = globalFunctions["removeCharacters"](id_eatenfood);
        removeEatenFood(id_eatenfood, function () {
            updateFoodLogPage();
        });
    });

    //listener to add a food to eaten foods from the custom foods list
    $(document).on("click", ".customfood", function () {
        var id_customFood = $(this).attr("id");
        console.log("id_customfood " + id_customFood + " will be added");
        id_customFood = globalFunctions.removeCharacters(id_customFood);
        addCustomFood(id_customFood, function () {
            updateFoodLogPage();
        });
    });


    //listener to add a food to eaten foods from the search result list
    $(document).on("click", ".searchresult", function () {
        var id_searchablefood = $(this).attr("id");
        console.log("id_searchablefood " + id_searchablefood + " will be added");
        id_searchablefood = globalFunctions["removeCharacters"](id_searchablefood);
        addEatenFoodFromSearchResult(id_searchablefood, function () {
            updateFoodLogPage();

        });
    });

    //listener to respond to searchButton click for searching the database
    $(document).on("click", "#searchButton", function () {
        var searchInput = document.getElementById("searchInput").value;
        console.log("searching for " + searchInput);
        searchForFood(searchInput, function () {
            updateFoodLogPage();
        });
    });
    //listener to respond to enter keypress for searching the database
    $("#searchInput").keypress(function (event) {
        if (event.which === 13)
        {
            var searchInput = document.getElementById("searchInput").value;
            console.log("searching for " + searchInput);
            searchForFood(searchInput, function () {
                updateFoodLogPage();
            });
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
        var id = $(this).attr("id");
        var id_searchablefood = globalFunctions["removeCharacters"](id);
        var id_searchablefoodweight = id_searchablefood + "weight";
        document.getElementById(id_searchablefoodweight).stepUp();
        updateSearchResultMacros(id);
    });

    $(document).on("click", ".decrementWeightButton", function (e) {
        e.stopPropagation(); //stops the triggering of all parent events
        var id = $(this).attr("id");
        var id_searchablefood = globalFunctions["removeCharacters"](id);
        var id_searchablefoodweight = id_searchablefood + "weight";
        document.getElementById(id_searchablefoodweight).stepDown();
        updateSearchResultMacros(id);
    });

    //listener for datepicker decrement date buttons
    $(document).on("click", ".searchresultInput", function (e) {
        e.stopPropagation(); //stops the triggering of all parent events
    });

    //listener for when the user changes the weight of a search result from the database
    $(document).on("change", ".searchresultInput", function (e) {
        e.stopPropagation(); //stops the triggering of all parent events
        var id = $(this).attr("id");
        console.log("search result weight change detected for input field: " + id);
        updateSearchResultMacros(id);
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
    var currentlyViewedDate = globalFunctions.getCurrentlyViewedDate();
    currentlyViewedDate.setDate(currentlyViewedDate.getDate() + 1);
    globalFunctions.setCurrentlyViewedDate(currentlyViewedDate);
    $('#foodDatePicker').datepicker('setDate', currentlyViewedDate);
}
function decrementDate()
{
    console.log("decrementDate()");
    var currentlyViewedDate = globalFunctions.getCurrentlyViewedDate();
    currentlyViewedDate.setDate(currentlyViewedDate.getDate() - 1);
    globalFunctions.setCurrentlyViewedDate(currentlyViewedDate);
    $('#foodDatePicker').datepicker('setDate', currentlyViewedDate);
}