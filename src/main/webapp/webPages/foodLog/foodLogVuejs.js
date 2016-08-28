
var foodLogVue = function () {

    var vueComponents = function(){
   
    var EatenFoodLog = Vue.extend({
  template: `<ul class="list-group">
                <div v-if="eatenFoodsArrayFriendly.length !== 0">
                    <li v-for="food in eatenFoodsArrayFriendly" class="list-group-item" track-by="identifierFoodProperties.foodUuid">
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
                                <div v-if="food.vitamins">
                                    <div class="label label-info">Vitamins:</div>
                                    <br>
                                    <span v-for="property in food.vitamins">
                                        <span class="label label-success">{{ friendlyFoodProperties[$key] }}: {{ property }}</span>
                                    </span>
                                </div>
                                <div v-if="food.minerals">
                                    <div class="label label-info">Minerals:</div>
                                    <br>
                                    <span v-for="property in food.minerals">
                                        <span class="label label-success">{{ friendlyFoodProperties[$key] }}: {{ property }}</span>
                                    </span>
                                </div>
                            </div>
                        </div>             
                        <div class="row pull right spacer">
                            <div class="col-sm-12">
                                <button type="button" class="btn btn-default btn-xs pull-right removeFoodButton" data-food-uuid="{{ food.identifierFoodProperties.foodUuid }}"><span class="glyphicon glyphicon-minus" style="color:red"></span> Remove</button>
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
    
    var CustomFoodList = Vue.extend({
template: `<ul class="list-group">
              <div v-if="customFoodsArrayFriendly.length !== 0">
                  <li v-for="food in customFoodsArrayFriendly" class="list-group-item" track-by="identifierFoodProperties.foodUuid">
                      <div class="row">
                          <div class="col-sm-12">
                              <button type="button" data-toggle="modal" data-target="#foodInfoModal" data-food-uuid="{{ food.identifierFoodProperties.foodUuid }}" class="btn btn-primary btn-xs foodInfoButton">{{ food.descriptiveFoodProperties.foodname }} <span class="glyphicon glyphicon-info-sign"></span></button>
                              <br>
                              <div class="label label-info">Primary Macros:</div>
                              <br>
                              <span v-for="property in food.primaryFoodProperties">
                                  <span class="label label-success">{{ friendlyFoodProperties[$key] }}: {{ property }}</span>
                              </span>
                              <br>
                              <div v-if="food.secondaryFoodProperties">
                                  <div class="label label-info">Secondary Macros:</div>
                                  <br>
                                  <span v-for="property in food.secondaryFoodProperties">
                                      <span class="label label-success">{{ friendlyFoodProperties[$key] }}: {{ property }}</span>
                                  </span>
                              </div>
                               <div v-if="food.vitamins">
                                    <div class="label label-info">Vitamins:</div>
                                    <br>
                                    <span v-for="property in food.vitamins">
                                        <span class="label label-success">{{ friendlyFoodProperties[$key] }}: {{ property }}</span>
                                    </span>
                                </div>
                                <div v-if="food.minerals">
                                    <div class="label label-info">Minerals:</div>
                                    <br>
                                    <span v-for="property in food.minerals">
                                        <span class="label label-success">{{ friendlyFoodProperties[$key] }}: {{ property }}</span>
                                    </span>
                                </div>
                          </div>
                      </div>
                    <div class="row pull right spacer">
                        <div class="col-sm-12">
                            <button type="button" class="btn btn-default btn-xs pull-right eatenCustomFoodButton" data-food-uuid="{{ food.identifierFoodProperties.foodUuid }}"><span class="glyphicon glyphicon-plus" style="color:green"></span> Add to log</button>
                        </div>
                  </li>
              </div>
              <div v-else>
                  <li class="list-group-item">
                      <div class="row">
                          <div class="col-sm-12">
                              <h1><small><p class="text-center">You havent created any custom foods :(</p></small></h1>
                          </div>
                      </div>
                  </li>
              </div>
            </ul>`});
    
    var SearchResultsFoodList = Vue.extend({
template:             `<ul class="list-group">
                            <li v-for="food in searchResultsArrayFriendly | orderBy 'descriptiveFoodProperties.foodname.length'" class="list-group-item" id="{{ food.identifierFoodProperties.foodUuid }}" track-by="identifierFoodProperties.foodUuid">
                                <div class="row">
                                    <div class="col-sm-12">
                                        <button type="button" data-toggle="modal" data-target="#foodInfoModal" data-food-uuid="{{ food.identifierFoodProperties.foodUuid }}" class="btn btn-primary btn-xs foodInfoButton">{{ food.descriptiveFoodProperties.foodname }} <span class="glyphicon glyphicon-info-sign"></span></button>
                                        <br>
                                        <div class="label label-info">Primary Macros:</div>
                                        <br>
                                        <span v-for='primaryProperty in organizedSelectedFoodProperties.primaryFoodProperties'>
                                            <span v-if='primaryProperty'>
                                                <span class="label label-success">{{ friendlyFoodProperties[$key] }}: {{ food.primaryFoodProperties[$key] }}</span>
                                            </span>
                                        </span>
                                        <br>
                                        <div v-if="organizedSelectedFoodProperties.secondaryFoodProperties">
                                            <div class="label label-info">Secondary Macros:</div>
                                            <br>
                                            <span v-for='secondaryProperty in organizedSelectedFoodProperties.secondaryFoodProperties'>
                                                <span v-if='secondaryProperty'>
                                                    <span class="label label-success">{{ friendlyFoodProperties[$key] }}: {{ food.secondaryFoodProperties[$key] }}</span>
                                                </span>
                                            </span>
                                        </div>
                                        <div v-if="organizedSelectedFoodProperties.vitamins">
                                            <div class="label label-info">Vitamins:</div>
                                            <br>
                                            <span v-for='vitamin in organizedSelectedFoodProperties.vitamins'>
                                                <span v-if='vitamin'>
                                                    <span class="label label-success">{{ friendlyFoodProperties[$key] }}: {{ food.vitamins[$key] }}</span>
                                                </span>
                                            </span>
                                        </div>
                                        <div v-if="organizedSelectedFoodProperties.minerals">
                                            <div class="label label-info">Minerals:</div>
                                            <br>
                                            <span v-for='mineral in organizedSelectedFoodProperties.minerals'>
                                                <span v-if='mineral'>
                                                    <span class="label label-success">{{ friendlyFoodProperties[$key] }}: {{ food.minerals[$key] }}</span>
                                                </span>
                                            </span>
                                        </div>
                                    </div>     
                                </div>
                            <div class="row spacer">
                                <div class="col-sm-6">
                                    <div class='input-group input-group-sm'>
                                        <span class='input-group-btn'>
                                            <button class='btn btn-primary decrementWeightButton' type='button' data-food-uuid="{{ food.identifierFoodProperties.foodUuid }}">weight-</button>
                                        </span>
                                            <input type='number' class='form-control searchResultWeightInput' id="{{ food.identifierFoodProperties.foodUuid }}-weightinput" data-food-uuid="{{ food.identifierFoodProperties.foodUuid }}" placeholder='Weight(g)' step='100' min='0' max='100000' value="{{ food.primaryFoodProperties.weight }}">
                                        <span class='input-group-btn'>
                                            <button class='btn btn-primary incrementWeightButton' type='button' data-food-uuid="{{ food.identifierFoodProperties.foodUuid }}">weight+</button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="row pull right spacer">
                                <div class="col-sm-12">
                                    <button type="button" class="btn btn-default btn-xs pull-right eatenSearchResultButton" data-food-uuid="{{ food.identifierFoodProperties.foodUuid }}"><span class="glyphicon glyphicon-plus" style="color:green"></span> Add to log</button>
                            </div>
                        </div>
                            </li>
                      </ul>`});
              
//              var FoodInfoList = Vue.extend({
//template: `
//                      <div class="row">
//                          <div class="col-sm-12">
//                              <h3 class="text-center">{{ foodObjectFriendly.descriptiveFoodProperties.foodname }}</h3>
//                              <div class="label label-info">Primary Macros:</div>
//                              <br>
//                              <span v-for="property in foodObjectFriendly.primaryFoodProperties">
//                                  <span class="label label-success">{{ $key }}: {{ property }}</span>
//                              </span>
//                              <br>
//                              <div v-if="foodObjectFriendly.secondaryFoodProperties">
//                                  <div class="label label-info">Secondary Macros:</div>
//                                  <br>
//                                  <span v-for="property in foodObjectFriendly.secondaryFoodProperties">
//                                      <span class="label label-success">{{ $key }}: {{ property }}</span>
//                                  </span>
//                              </div>
//                                <div v-if="foodObjectFriendly.vitamins">
//                                    <div class="label label-info">Vitamins:</div>
//                                    <br>
//                                    <span v-for="property in food.vitamins">
//                                        <span class="label label-success">{{ $key }}: {{ property }}</span>
//                                    </span>
//                                </div>
//                                <div v-if="foodObjectFriendly.minerals">
//                                    <div class="label label-info">Minerals:</div>
//                                    <br>
//                                    <span v-for="property in food.minerals">
//                                        <span class="label label-success">{{ $key }}: {{ property }}</span>
//                                    </span>
//                                </div>
//                          </div>
//                      </div>
//`
//            });
            
            //vueComponents components
            return{
                EatenFoodLog:EatenFoodLog,
                CustomFoodList:CustomFoodList,
                SearchResultsFoodList:SearchResultsFoodList,
                //FoodInfoList:FoodInfoList 
            }
            
        }();
        
        
    $(document).ready(function () {
        var loadVueComponents = function() {           
        
            // create an instance
            var eatenFoodLog = new vueComponents.EatenFoodLog({
                replace:false,
                data: {
                    eatenFoodsArrayFriendly: fitnessTrackerGlobals.globalValues.friendlyValues.eatenFoodsArrayFriendly,
                    friendlyFoodProperties:fitnessTrackerGlobals.globalValues.friendlyValues.friendlyFoodProperties
                }
            });
            // mount it on an element
            eatenFoodLog.$mount('#eatenFoodsList');

            var customFoodList = new vueComponents.CustomFoodList({
                replace:false,            
                data: {
                    customFoodsArrayFriendly: fitnessTrackerGlobals.globalValues.friendlyValues.customFoodsArrayFriendly,
                    friendlyFoodProperties:fitnessTrackerGlobals.globalValues.friendlyValues.friendlyFoodProperties

                }
            });
            customFoodList.$mount('#customFoodsList');
            
            
            var organizedSelectedFoodProperties = fitnessTrackerGlobals.commonFunctions.organizeObject(fitnessTrackerGlobals.globalValues.userValues.selectedFoodProperties);
            //privateHelpers.removeSecondaryFoodPropertiesIfEmpty(organizedSelectedFoodProperties);
            fitnessTrackerGlobals.commonFunctions.deleteUnselectedEmptyAndNullProperties(organizedSelectedFoodProperties);
            //fitnessTrackerGlobals.commonFunctions.deleteEmptySubcategories(organizedSelectedFoodProperties);
            
            var searchResultsFoodList = new vueComponents.SearchResultsFoodList({
                replace:false, 
                data: {
                    organizedSelectedFoodProperties:organizedSelectedFoodProperties,           
                    searchResultsArrayFriendly: fitnessTrackerGlobals.globalValues.friendlyValues.searchResultsArrayFriendly,
                    friendlyFoodProperties:fitnessTrackerGlobals.globalValues.friendlyValues.friendlyFoodProperties
                }
            });
            searchResultsFoodList.$mount('#searchResults');
        }();
        
    });
    
    
//    var privateHelpers = function(){
//        
//        function removeSecondaryFoodPropertiesIfEmpty(inputObject)
//        {          
//            //remove all false properties as they are not to be displayed
//            for(var property in inputObject.secondaryFoodProperties)
//            {
//                if(!inputObject.secondaryFoodProperties[property])
//                {
//                    delete inputObject.secondaryFoodProperties[property];
//                }
//            }
//            //if that leaves secondaryFoodProperties empty, delete it
//            if(jQuery.isEmptyObject(inputObject.secondaryFoodProperties))
//            {
//                delete inputObject.secondaryFoodProperties;
//            }
//        }
//        
//        //privateHelpers
//        return{
//            removeSecondaryFoodPropertiesIfEmpty:removeSecondaryFoodPropertiesIfEmpty
//        };
//    }();
    
         
         
//    function createEatenFoodInfo(foodUuid) {
//        var foodObject = fitnessTrackerGlobals.commonFunctions.findFoodByUuidSearchAllArrays(foodUuid);
//        var foodObjectFriendly = fitnessTrackerGlobals.commonFunctions.createFriendlyFood(foodObject,false);
//        var foodInfoList = new vueComponents.FoodInfoList({
//            data: {
//                foodObjectFriendly: foodObjectFriendly
//            }
//        });
//
//        foodInfoList.$mount('#foodInfo');
//    }
    
    //setup vue.js instance
    var vm = new Vue({
    
    });
     
    //foodLogVueFunctions functions/variables
    return{
        //createEatenFoodInfo:createEatenFoodInfo,
        vueComponents:vueComponents
    };
}();
