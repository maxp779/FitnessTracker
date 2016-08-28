var customFoodsVue= function(){
    
    var vueComponents = function(){
       var CustomFoodListEditable = Vue.extend({
  template: `<ul class="list-group">
                <div v-if="customFoodsArrayFriendly.length !== 0">
                    <li v-for="food in customFoodsArrayFriendly" class="list-group-item" track-by="identifierFoodProperties.foodUuid">
                        <div class="row">
                            <div class="col-sm-12">
                                <button type="button" class="btn btn-primary btn-xs foodInfoButton" data-toggle="modal" data-target="#foodInfoModal" data-food-uuid="{{ food.identifierFoodProperties.foodUuid }}">{{ food.descriptiveFoodProperties.foodname }} <span class="glyphicon glyphicon-info-sign"></span></button>
                                <br>
                                <div class="label label-info">Primary Macros:</div>
                                <br>
                                <span v-for="property in food.primaryFoodProperties">
                                    <span class="label label-success">{{ friendlyFoodProperties[$key] }}: {{ property }}</span>
                                </span>
                                <div v-if="food.secondaryFoodProperties">
                                    <div class="label label-info">Secondary Macros:</div>
                                    <br>
                                    <span v-for="property in food.secondaryFoodProperties">
                                        <span class="label label-success">{{ friendlyFoodProperties[$key] }}: {{ property }}</span>
                                    </span>
                                </div>
                            </div>
                        </div>             
                        <div class="row pull right spacer">
                            <div class="col-sm-12">
                                <button type="button" class="btn btn-default btn-xs pull-left removeCustomFoodButton" data-food-uuid="{{ food.identifierFoodProperties.foodUuid }}"><span class="glyphicon glyphicon-minus" style="color:red"></span> Delete</button>
                                <button type="button" class="btn btn-default btn-xs pull-right editCustomFoodButton" data-toggle="modal" data-target="#editCustomFoodModal" data-food-uuid="{{ food.identifierFoodProperties.foodUuid }}"><span class="glyphicon glyphicon-edit"></span>Edit</button>
                            </div>
                        </div>
                    </li>
                </div>
                <div v-else>
                    <li class="list-group-item">
                        <div class="row">
                            <div class="col-sm-12">
                                <h1><small><p class="text-center">Nothing eaten today :(</p></small></h1>
                            </div>
                        </div>
                    </li>
                </div>
            </ul>`});
    
    var CreateCustomFoodForm = Vue.extend({
  template: `<form id=createCustomFoodForm role=form>
    <div class='form-group'>
        <div class='row'>
            <div class='col-sm-12'>
            <h3>Primary food properties</h3>
                <label for='food'>Foodname:</label>
                <input type='text' class='form-control' name='foodname' required autofocus>
                <div v-for="primaryProperty in organizedSelectedFoodProperties.primaryFoodProperties">
                    <div v-if="primaryProperty">
                        <label for='{{ $key }}'>{{ friendlyFoodProperties[$key] }}:</label>
                        <input type='text' class='form-control' name='{{ $key }}'>
                    </div>
                </div>
            </div>
        </div>
        <div class='row'>
            <div class='col-sm-12'>
            <div v-if="organizedSelectedFoodProperties.secondaryFoodProperties">
                <h3>Secondary food properties</h3>
                    <div v-for="secondaryProperty in organizedSelectedFoodProperties.secondaryFoodProperties">
                        <div v-if="secondaryProperty">
                            <label for='{{ $key }}'>{{ friendlyFoodProperties[$key] }}:</label>
                            <input type='text' class='form-control' name='{{ $key }}'>
                        </div>
                    </div>
                </div>
            </div>
        </div>
<div class='row'>
            <div class='col-sm-12'>
            <div v-if="organizedSelectedFoodProperties.vitamins">
                <h3>Vitamins</h3>
                    <div v-for="vitamins in organizedSelectedFoodProperties.vitamins">
                        <div v-if="vitamins">
                            <label for='{{ $key }}'>{{ friendlyFoodProperties[$key] }}:</label>
                            <input type='text' class='form-control' name='{{ $key }}'>
                        </div>
                    </div>
                </div>
            </div>
        </div>
<div class='row'>
            <div class='col-sm-12'>
            <div v-if="organizedSelectedFoodProperties.minerals">
                <h3>Minerals</h3>
                    <div v-for="minerals in organizedSelectedFoodProperties.minerals">
                        <div v-if="minerals">
                            <label for='{{ $key }}'>{{ friendlyFoodProperties[$key] }}:</label>
                            <input type='text' class='form-control' name='{{ $key }}'>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
        <button id='createCustomFoodButton' type='submit' class='btn btn-primary spacer'>Create custom food</button>
    </div>
</form>`});

     var EditCustomFoodForm = Vue.extend({
  template: `<form id=editCustomFoodForm role=form data-food-uuid="{{ customFoodToEditCopy.identifierFoodProperties.foodUuid }}">
    <div class='form-group'>
        <div class='row'>
            <div class='col-sm-12'>
            <h3>Primary food properties</h3>
                <label for='food'>Foodname:</label>
                <input type='text' class='form-control' name='foodname' value='{{ customFoodToEditCopy.descriptiveFoodProperties.foodname }}' required autofocus>
                <div v-for='primaryProperty in organizedSelectedFoodProperties.primaryFoodProperties'>
                    <div v-if='primaryProperty'>
                        <label for='{{ $key }}'>{{ friendlyFoodProperties[$key] }}:</label>
                        <input type='text' id='{{ $key }}input' class='form-control' name='{{ $key }}' value='{{ customFoodToEditCopy.primaryFoodProperties[$key] }}'>
                    </div>
                </div>
            </div>
        </div>
        <div class='row'>
            <div class='col-sm-12'>
                <div v-if='organizedSelectedFoodProperties.secondaryFoodProperties'>
                <h3>Secondary food properties</h3>
                    <div v-for='secondaryProperty in organizedSelectedFoodProperties.secondaryFoodProperties'>
                        <div v-if='secondaryProperty'>
                            <label for='{{ $key }}'>{{ friendlyFoodProperties[$key] }}:</label>
                            <input type='text' id='{{ $key }}input' class='form-control' name='{{ $key }}' value='{{ customFoodToEditCopy.secondaryFoodProperties[$key] }}'>
                        </div>
                    </div>
                </div>
            </div>           
        </div>
        <div class='row'>
            <div class='col-sm-12'>
                <div v-if='organizedSelectedFoodProperties.vitamins'>
                <h3>Vitamins</h3>
                    <div v-for='vitamin in organizedSelectedFoodProperties.vitamins'>
                        <div v-if='vitamin'>
                            <label for='{{ $key }}'>{{ friendlyFoodProperties[$key] }}:</label>
                            <input type='text' id='{{ $key }}input' class='form-control' name='{{ $key }}' value='{{ customFoodToEditCopy.vitamins[$key] }}'>
                        </div>
                    </div>
                </div>
            </div>           
        </div>
        <div class='row'>
            <div class='col-sm-12'>
                <div v-if='organizedSelectedFoodProperties.minerals'>
                <h3>Minerals</h3>
                    <div v-for='mineral in organizedSelectedFoodProperties.minerals'>
                        <div v-if='mineral'>
                            <label for='{{ $key }}'>{{ friendlyFoodProperties[$key] }}:</label>
                            <input type='text' id='{{ $key }}input' class='form-control' name='{{ $key }}' value='{{ customFoodToEditCopy.minerals[$key] }}'>
                        </div>
                    </div>
                </div>
            </div>           
        </div>
    </div>
        <button id='editCustomFoodButton' type='submit' class='btn btn-primary spacer'>Save edited food</button>
    </div>
</form>`});

    
    //vueComponents
        return{
            CustomFoodListEditable:CustomFoodListEditable,
            CreateCustomFoodForm:CreateCustomFoodForm,
            EditCustomFoodForm:EditCustomFoodForm
        }
    }();

    
     $(document).ready(function () {
        var loadVueComponents = function() {
            // create an instance
            var customFoodsListEditable = new vueComponents.CustomFoodListEditable({
                replace:false,
                data: {
                    customFoodsArrayFriendly: fitnessTrackerGlobals.globalValues.friendlyValues.customFoodsArrayFriendly,
                    friendlyFoodProperties:fitnessTrackerGlobals.globalValues.friendlyValues.friendlyFoodProperties

                }
            });           
            customFoodsListEditable.$mount('#customFoodsListEditable');
            
            var organizedSelectedFoodProperties = fitnessTrackerGlobals.commonFunctions.organizeObject(fitnessTrackerGlobals.globalValues.userValues.selectedFoodProperties);
            fitnessTrackerGlobals.commonFunctions.deleteUnselectedEmptyAndNullProperties(organizedSelectedFoodProperties);
            
            var createCustomFoodForm = new vueComponents.CreateCustomFoodForm({
                replace:false,
                data: {
                    organizedSelectedFoodProperties:organizedSelectedFoodProperties,
                    friendlyFoodProperties:fitnessTrackerGlobals.globalValues.friendlyValues.friendlyFoodProperties
                }
            });          
            createCustomFoodForm.$mount('#createCustomFood');            
            
        }();
    });
    
    var privateHelpers = function(){
        
        function deleteEmptySubcategoriesWithUnselectedProperties(currentFood)
        {
            for (var subcategory in currentFood)
            {    
                var isNonOperableSubcategory = (subcategory === "descriptiveFoodProperties" || subcategory === "identifierFoodProperties");
                if (!isNonOperableSubcategory)
                {
                    var containsSelectedProperty = false;
                    innerLoop: for (var property in currentFood[subcategory])
                    {
                        if (fitnessTrackerGlobals.globalValues.userValues.selectedFoodProperties[property])
                        {
                            containsSelectedProperty = true;
                            break innerLoop;
                        }
                    }
                    if(!containsSelectedProperty)
                    {
                        delete currentFood[subcategory];
                    }
                }
            }
        }
        
        //privateHelpers
        return{
            deleteEmptySubcategoriesWithUnselectedProperties:deleteEmptySubcategoriesWithUnselectedProperties
        };
    }();
    
    var vueFunctions = function(){
        
        function createEditCustomFoodForm(foodUuid)
        {
            var customFoodToEdit = fitnessTrackerGlobals.commonFunctions.findFoodObjectByUuid(fitnessTrackerGlobals.globalValues.userValues.customFoodsArray,foodUuid);
            
            
            var customFoodToEditCopy = jQuery.extend(true,{},customFoodToEdit);
            //fitnessTrackerGlobals.commonFunctions.deleteEmptyOrNullProperties(customFoodToEditCopy);
            
            
                    //var customFoodToEditCopy = fitnessTrackerGlobals.commonFunctions.removeUnselectedProperties(customFoodToEdit);
            var organizedSelectedFoodProperties = fitnessTrackerGlobals.commonFunctions.organizeObject(fitnessTrackerGlobals.globalValues.userValues.selectedFoodProperties);
            //privateHelpers.removeSecondaryFoodPropertiesIfEmpty(organizedSelectedFoodProperties);
            privateHelpers.deleteEmptySubcategoriesWithUnselectedProperties(organizedSelectedFoodProperties);
            

            
            var createEditForm = new vueComponents.EditCustomFoodForm({
                replace:false,
                data: {
                    customFoodToEditCopy:customFoodToEditCopy,
                    organizedSelectedFoodProperties:organizedSelectedFoodProperties,
                    friendlyFoodProperties:fitnessTrackerGlobals.globalValues.friendlyValues.friendlyFoodProperties
                }
            });          
            createEditForm.$mount('#editCustomFood');
            //customFoodsPage.customFoodsFunctions.loadCustomFoodValuesOntoForm(foodUuid);
        }
        //vueFunctions
        return{
            createEditCustomFoodForm:createEditCustomFoodForm
        }
        
    }();
    
    //setup vue.js instance
    var vm = new Vue({
    
    });
        
    //customFoodsVue       
    return{
        vueComponents:vueComponents,
        vueFunctions:vueFunctions
    };
}();