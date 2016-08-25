var globalVue = function(){
    
    var vueComponents= function(){
                  var FoodInfoList = Vue.extend({
                    template: `
                      <div class="row">
                          <div class="col-sm-12">
                              <h3 class="text-center">{{ foodObjectFriendly.descriptiveFoodProperties.foodname }}</h3>
                              <div class="label label-info">Primary Macros:</div>
                              <br>
                              <span v-for="property in foodObjectFriendly.primaryFoodProperties">
                                <span v-if="friendlyFoodProperties[$key]">
                                    <span class="label label-success">{{ friendlyFoodProperties[$key] }}: {{ property }}</span>
                                </span>
                                <span v-else>
                                    <span class="label label-success">{{ $key }}: {{ property }}</span>
                                </span>
                              </span>
                              <br>
                              <div v-if="foodObjectFriendly.secondaryFoodProperties">
                                  <div class="label label-info">Secondary Macros:</div>
                                  <br>
                                  <span v-for="property in foodObjectFriendly.secondaryFoodProperties">
                                    <span v-if="friendlyFoodProperties[$key]">
                                        <span class="label label-success">{{ friendlyFoodProperties[$key] }}: {{ property }}</span>
                                    </span>
                                    <span v-else>
                                        <span class="label label-success">{{ $key }}: {{ property }}</span>
                                    </span>
                                  </span>
                              </div>
                          </div>
                      </div>
                    `
            });
            
            //vueComponents
            return{
                FoodInfoList:FoodInfoList
            }
        }();
        
        
    var vueRelatedFunctions= function(){
        
        function createEatenFoodInfo(foodUuid) {
            var foodObject = fitnessTrackerGlobals.commonFunctions.findFoodByUuidSearchAllArrays(foodUuid);
            var foodObjectFriendly = fitnessTrackerGlobals.commonFunctions.removeSecondaryPropertiesIfEmpty(foodObject);
            //var foodObjectFriendly = fitnessTrackerGlobals.commonFunctions.removeUnselectedProperties(foodObject,false);
            var foodInfoList = new vueComponents.FoodInfoList({
                data: {
                    foodObjectFriendly: foodObjectFriendly,
                    friendlyFoodProperties:fitnessTrackerGlobals.globalValues.friendlyValues.friendlyFoodProperties
                }
            });

            foodInfoList.$mount('#foodInfo');
        }

        //vueRelatedFunctions
        return{
            createEatenFoodInfo:createEatenFoodInfo
        }
    }();
    
    //globalVue
    return{
        vueComponents:vueComponents,
        vueRelatedFunctions:vueRelatedFunctions
    };
}();