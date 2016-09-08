var foodLogEvents = function () {

    function setupAllEvents(callback)
    {
        setupEventCategories.setupDateRelatedEvents();
        setupEventCategories.setupCustomFoodRelatedEvents();
        setupEventCategories.setupFoodSearchRelatedEvents();
        setupEventCategories.setupManualFoodEvents();
        setupEventCategories.setupRemoveFoodEvents();
        setupEventCategories.setupMiscEvents();

        if (callback)
        {
            callback();
        }
    }

    var setupEventCategories = function () {

        function setupDateRelatedEvents()
        {
            //create datepicker
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
                fitnessTrackerGlobals.ajaxFunctions.getEatenFoodList(currentlyViewedDate);
            });

            $(document).on("click", "#incrementDateButton", function (e) {
                foodLogPresentation.incrementDate();
            });

            $(document).on("click", "#decrementDateButton", function (e) {
                foodLogPresentation.decrementDate();
            });
        }

        function setupFoodSearchRelatedEvents()
        {
            //listener to respond to searchButton click for searching the database
            $('#searchDatabaseButton').on("click", function () {
                var searchInput = document.getElementById("searchInput").value;
                foodLogAjax.searchForFood(searchInput);
            });

            //listener to respond to "enter" keypress for searching the database
            $("#searchInput").on('keypress', function (e) {
                if (e.which === 13)
                {
                    var searchInput = document.getElementById("searchInput").value;
                    foodLogAjax.searchForFood(searchInput);
                }
            });

            //show default user feedback
            $('#searchInput').on("click", function (e) {
                document.getElementById("searchFeedback").innerHTML = foodLogPresentation.userFeedbackHtml.searchDefault;
            });

            //listener for when the user changes the weight of a search result directly
            $('#searchResults').on("change keyup paste", ".searchResultWeightInput", function (e) {
                var changedElement = this;
                var foodUuid = changedElement.dataset.foodUuid;
                var newWeight = changedElement.value;
                console.log("search result weight change detected for input field: " + foodUuid);
                foodLogPresentation.updateSearchResultMacros(foodUuid, newWeight);
            });

            //listener for when the user changes the weight of a search result with buttons
            $("#searchResults").on('click', '.btn', function (event)
            {
                var clickedClass = event.target.className;

                if (clickedClass.includes('decrementWeightButton'))
                {
                    var clickedElement = this;
                    var foodUuid = clickedElement.dataset.foodUuid;
                    var elementId = foodUuid + "-weightinput";
                    var weightInput = document.getElementById(elementId);
                    weightInput.stepDown();
                    var newWeight = weightInput.value;
                    foodLogPresentation.updateSearchResultMacros(foodUuid, newWeight);

                } else if (clickedClass.includes('incrementWeightButton'))
                {
                    var clickedElement = this;
                    var foodUuid = clickedElement.dataset.foodUuid;
                    var elementId = foodUuid + "-weightinput";
                    var weightInput = document.getElementById(elementId);
                    weightInput.stepUp();
                    var newWeight = weightInput.value;
                    foodLogPresentation.updateSearchResultMacros(foodUuid, newWeight);
                }
            });

            //listener to add a food to eaten foods from the search result list
            $('#searchResults').on("click", ".eatenSearchResultButton", function () {
                var clickedElement = this;
                var foodUuid = clickedElement.dataset.foodUuid;
                var userFeedbackElementId = foodUuid+"feedback"
                var userFeedbackElement = document.getElementById(userFeedbackElementId);
                foodLogAjax.addEatenFoodFromSearchResult(foodUuid, userFeedbackElement);
            });
        }

        function setupCustomFoodRelatedEvents()
        {
            //listener to add a food to eaten foods from the custom foods list
            $('#customFoodsList').on("click", ".eatenCustomFoodButton", function () {
                var clickedElement = this;
                var foodUuid = clickedElement.dataset.foodUuid;
                var userFeedbackElementId = foodUuid+"feedback"
                var userFeedbackElement = document.getElementById(userFeedbackElementId);
                foodLogAjax.addCustomFood(foodUuid,userFeedbackElement);
            });
        }
        function setupManualFoodEvents()
        {
            //listener for adding food manually
            //.submit is used because the button is attached to a form
            $("#addEatenFoodForm").submit(function (event) {
                console.log("add food manually button triggered");
                event.preventDefault(); //this prevents the default actions of the form
                foodLogAjax.addEatenFoodManually(function () {
                    fitnessTrackerGlobals.ajaxFunctions.getEatenFoodList();
                });
            });
        }

        function setupRemoveFoodEvents()
        {
            //listener for remove food buttons on food eaten table
            $('#eatenFoodsList').on("click", ".removeFoodButton", function () {
                console.log("remove eaten food button triggered");
                var clickedElement = this;
                var foodUuid = clickedElement.dataset.foodUuid;
                console.log("foodUuid " + foodUuid + " selected for removal");
                foodLogAjax.removeEatenFood(foodUuid);
            });
        }

        function setupMiscEvents()
        {
            //auto selects form input text when clicked
            $(document).on('click', 'input', function () {
                this.select();
            });

            //listener for food info button click
            $(document).on("click", ".foodInfoButton", function (e) {
                e.stopPropagation();
                var clickedElement = this;
                var foodUuid = clickedElement.dataset.foodUuid;
                globalVue.vueRelatedFunctions.createEatenFoodInfo(foodUuid);
            });
        }
        
        //setupEventCategories functions
        return{
            setupDateRelatedEvents: setupDateRelatedEvents,
            setupFoodSearchRelatedEvents: setupFoodSearchRelatedEvents,
            setupCustomFoodRelatedEvents: setupCustomFoodRelatedEvents,
            setupManualFoodEvents: setupManualFoodEvents,
            setupRemoveFoodEvents: setupRemoveFoodEvents,
            setupMiscEvents: setupMiscEvents
        };
    }();
    
    //foodLogEvents functions
    return{
        setupAllEvents: setupAllEvents
    };
}();
