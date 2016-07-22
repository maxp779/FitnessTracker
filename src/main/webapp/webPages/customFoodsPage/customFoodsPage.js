/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var id_customfoodBeingEdited;

$(document).ready(function () {
    globalFunctions.setupNavbar();
    globalFunctions.refreshGlobalValuesFromLocalStorage(function () {
        populateCustomFoodList();
    });

    //remove food listener
    $(document).on("click", ".remove-food-button", function () {
        var id_customfood = $(this).attr("id");
        id_customfood = globalFunctions.removeCharacters(id_customfood);
        deleteCustomFood(id_customfood, function () {
            populateCustomFoodList();
        });
        console.log("remove food button clicked");
    });

    //edit food listener
    $(document).on("click", ".edit-food-button", function () {
        console.log("edit button clicked");
        var id_customfood = $(this).attr("id");
        id_customfood = globalFunctions.removeCharacters(id_customfood);
        id_customfoodBeingEdited = id_customfood;
        editCustomFood(id_customfood); //load the selected foods current values onto the form
    });

    $(document).on("submit", "#edit-food-form", function (e) {
        console.log("EVENT FIRING!");
        saveEditedCustomFood();
        $('#edit-food-modal').modal('hide');
        return false;
    });

    $(document).on("submit", "#addFoodForm", function (event) {
        event.preventDefault();
        createCustomFood();
    });

    $(document).on("focus", "#addFoodForm", function () {
        document.getElementById("addCustomFoodFeedback").innerHTML = "";
    });


//auto selects form input text when clicked
    $(document).on('click', 'input', function () {
        this.select();
    });
    generateCustomFoodsFormHTML();
});

function populateCustomFoodList()
{
    //list must be emptied first, if not then the final list item will still show
    //even if it was deleted from the database
    $('#customFoodList').empty();
    var customFoodsArrayRef = globalValues.userValues.customFoodsArray;

    //iterate through each array (database record) in the JSON
    var innerHTML = "";
    for (var index = 0; index < customFoodsArrayRef.length; index++)
    {
        var currentFood = customFoodsArrayRef[index];
        innerHTML = innerHTML.concat("<div class='row'>"
                + "<div class='col-sm-12'>"
                + "<li class='list-group-item' id='" + currentFood.id_customfood + "eatenfood" + "'>"
                + "<div class='row'>"
                + "<div class='col-sm-8'>"
                + globalFunctions.createFoodAttributesHTML(currentFood, "id_customfood")
                + "</div>"
                + "<div class='col-sm-4'>"
                + "<p><button type='button' class='btn btn-danger btn-md pull-right remove-food-button' id='" + currentFood["id_customfood"] + "customfoodremove" + "'>Remove <span class='glyphicon glyphicon-remove'></span></button>"
                + "<button type='button' data-toggle='modal' data-target='#edit-food-modal' class='btn btn-info btn-md pull-right edit-food-button' id='" + currentFood["id_customfood"] + "customfoodedit" + "'>Edit <span class='glyphicon glyphicon-edit'></span></button></p>"
                + "</div>"
                + "</div>"
                + "</li>"
                + "</div>"
                + "</div>"
                );

    }
    document.getElementById("customFoodList").innerHTML = innerHTML;
}


function deleteCustomFood(id_customfood, callback)
{
    var foodToDelete = {};
    foodToDelete.id_customfood = id_customfood;
    $.ajax({
        url: serverAPI.requests.DELETE_CUSTOM_FOOD,
        type: "POST",
        data: JSON.stringify(foodToDelete),
        contentType: "application/json",
        dataType: "json",
        success: function (returnObject)
        {
            if (returnObject.success === true)
            {
                console.log("custom food removal suceeded");
                globalFunctionsAjax.getCustomFoodList(function () {
                    if (callback)
                    {
                        callback();
                    }
                });

            } else
            {
                console.log("Error:" + serverAPI.errorCodes[returnObject.errorCode]);
            }
        },
        error: function (xhr, status, error)
        {
            console.log("Ajax request failed:" + error.toString());
        }
    });

}

function createCustomFood()
{
    //get data from form, it is formatted as an array of JSON object with the
    //form data held in name/value pairs like so:
    //[{"name":"foodname", "value":"tasty pie"},{"name":"protein", "value":"25"}]
    var formData = $("#addFoodForm").serializeArray();

    var newCustomFood = globalFunctions.convertFormArrayToJSON(formData);
    //prepare the JSON to send to server
//    var outputJSON = {};
//    for (var count in formData)
//    {
//        if (formData[count]["value"] !== "")
//        {
//            outputJSON[formData[count]["name"]] = formData[count]["value"];
//        }
//    }
    console.log("attempting to create custom food " + newCustomFood);
    $.ajax({
        url: serverAPI.requests.CREATE_CUSTOM_FOOD,
        type: "POST",
        data: JSON.stringify(newCustomFood),
        contentType: "application/json",
        dataType: "json",
        success: function (returnObject)
        {
            if (returnObject.success === true)
            {
                console.log("food add suceeded");
                globalFunctionsAjax.getCustomFoodList(function () {
                    populateCustomFoodList();
                });

                document.getElementById("addFoodForm").reset();
                document.getElementById("addCustomFoodFeedback").innerHTML = "<div class=\"alert alert-success\" role=\"alert\">Custom food " + returnObject.data.foodname + " successfully created</div>";

            } else
            {
                console.log("Error:" + serverAPI.errorCodes[returnObject.errorCode]);
                document.getElementById("addCustomFoodFeedback").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">" + serverAPI.errorCodes[returnObject.errorCode] + " please try again</div>";
            }
        },
        error: function (xhr, status, error)
        {
            console.log("Ajax request failed:" + error.toString());
        }
    });
}

function editCustomFood(id_customfood)
{
    var foodToEdit = findCustomFood(id_customfood);

    console.log(JSON.stringify(foodToEdit));

    //clear form
    document.getElementById("edit-food-form").reset();

    //populate form
    if (foodToEdit.hasOwnProperty("foodname"))
    {
        document.getElementById("editfoodname").value = foodToEdit["foodname"];
    }
    if (foodToEdit.hasOwnProperty("protein"))
    {
        document.getElementById("editprotein").value = foodToEdit["protein"];
    }
    if (foodToEdit.hasOwnProperty("carbohydrate"))
    {
        document.getElementById("editcarbohydrate").value = foodToEdit["carbohydrate"];
    }
    if (foodToEdit.hasOwnProperty("fat"))
    {
        document.getElementById("editfat").value = foodToEdit["fat"];
    }
    if (foodToEdit.hasOwnProperty("calorie"))
    {
        document.getElementById("editcalorie").value = foodToEdit["calorie"];
    }
}

function saveEditedCustomFood()
{
    //get data from form, it is formatted as an array of JSON object with the
    //form data held in name/value pairs like so:
    //[{"name":"foodname", "value":"tasty pie"},{"name":"protein", "value":"25"}]
    var formData = $("#edit-food-form").serializeArray();
    //prepare the JSON to send to server
    var outputJSON = {"id_customfood": id_customfoodBeingEdited};
    for (var index = 0; index < formData.length; index++)
    {
        if (formData[index]["value"] !== "")
        {
            outputJSON[formData[index]["name"]] = formData[index]["value"];
        }
    }

//    for (var count in formData)
//    {
//        if (formData[count]["value"] !== "")
//        {
//            outputJSON[formData[count]["name"]] = formData[count]["value"];
//        }
//    }
    console.log("attempting to edit food " + JSON.stringify(outputJSON));
    $.ajax({
        url: serverAPI.requests.EDIT_CUSTOM_FOOD,
        type: "POST",
        data: JSON.stringify(outputJSON),
        contentType: "application/json",
        dataType: "json",
        success: function (returnObject)
        {
            if (returnObject.success === true)
            {
                console.log("food edit suceeded");
                globalFunctionsAjax.getCustomFoodList(function () {
                    populateCustomFoodList();
                });
            } else
            {
                console.log("Error:" + serverAPI.errorCodes[returnObject.errorCode]);
            }
        },
        error: function (xhr, status, error)
        {
            console.log("Ajax request failed:" + error.toString());
        }
    });
}


//find food from id_customfood, this may be useful in future
function findCustomFood(id_customfood)
{
    var foodObject;
    var customFoodsArrayRef = globalValues.userValues.customFoodsArray;
    for (var index in customFoodsArrayRef)
    {
        if (customFoodsArrayRef[index].id_customfood === id_customfood)
        {
            foodObject = customFoodsArrayRef[index];
            return foodObject;
        }
    }
    return foodObject;
}


function generateCustomFoodsFormHTML()
{
    var outputHTML = "";
    var selectedAttributeArray = globalFunctions.getSelectedAttributes();
    var primaryAttributeArray = ["foodname", "protein", "carbohydrate", "fat", "calorie"];
    var secondaryAttributeArray = [];

    for (var index = 0; index < selectedAttributeArray.length; index++)
    {
        var currentAttribute = selectedAttributeArray[index];
        if (!(currentAttribute === "protein" || currentAttribute === "carbohydrate" || currentAttribute === "fat"
                || currentAttribute === "calorie" || currentAttribute === "foodname" || currentAttribute === "weight"))
        {
            secondaryAttributeArray.push(currentAttribute);
        }
    }

    outputHTML = outputHTML.concat("<div class='form-group'>"
            + "<div class='row'>"
            + "<div class='col-sm-3'>"
            + "<label for='food'>Foodname:</label>"
            + "<input type='text' class='form-control' id='foodname' name='foodname' required autofocus>"
            + "<label for='protein'>Protein:</label>"
            + "<input type='number' max='100000' class='form-control' id='protein' step='any' name='protein'>"
            + "<label for='carbs'>Carbs:</label>"
            + "<input type='number' max='100000' class='form-control' id='carbohydrate' step='any' name='carbohydrate'>"
            + "<label for='fats'>Fats:</label>"
            + "<input type='number' max='100000' class='form-control' id='fat' step='any' name='fat'>"
            + "<label for='calories'>Calories:</label>"
            + "<input type='number' max='100000' class='form-control' id='calorie' step='any' name='calorie'>"
            + "</div>");

    var inputsPerColumn = 5;
    var currentColumnInputs = 0;
    for (var index = 0; index < secondaryAttributeArray.length; index++)
    {
        if (currentColumnInputs === 0)
        {
            outputHTML = outputHTML.concat("<div class='col-sm-3'>");
        }

        if (!(currentColumnInputs < inputsPerColumn))
        {
            outputHTML = outputHTML.concat("</div>" //end previous column
                    + "<div class='col-sm-3'>");             //begin new column
            currentColumnInputs = 0;
        }

        var currentFoodAttribute = secondaryAttributeArray[index];
        var currentFoodAttributeFriendlyName = globalValues.friendlyValues.friendlyFoodAttributes[currentFoodAttribute];

        outputHTML = outputHTML.concat("<label for=" + currentFoodAttribute + ">" + currentFoodAttributeFriendlyName + ":</label>"
                + "<input type='number' max='100000' class='form-control' step='any' id=" + currentFoodAttribute + " name=" + currentFoodAttribute + ">");

        currentColumnInputs++;
    }

    if (currentColumnInputs < inputsPerColumn)
    {
        outputHTML = outputHTML.concat("</div>"); //close column if it wasent full
    }

    outputHTML = outputHTML.concat("</div>"); //end row
    outputHTML = outputHTML.concat("<button id='addFoodButton' type='submit' class='btn btn-primary spacer'>Create food</button>");
    outputHTML = outputHTML.concat("</div>"); //end form group

    document.getElementById("addFoodForm").innerHTML = outputHTML;
}
