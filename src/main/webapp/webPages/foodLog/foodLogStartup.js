/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//Setup code
$(document).ready(function () {

    fitnessTrackerGlobals.commonFunctions.setupNavbar();

    setupEvents(function ()
    {
        updateFoodLogPage();

        console.log(fitnessTrackerGlobals.globalValues.friendlyValues.eatenFoodsArrayFriendly);
                console.log(fitnessTrackerGlobals.globalValues.friendlyValues.customFoodsArrayFriendly)
        console.log(fitnessTrackerGlobals.globalValues.friendlyValues.searchResultsArrayFriendly)

    });

//    var foodLog = new Vue({
//        el: '#eatenFoodLog',
//        data: {
//            eatenFoodsArrayFriendly: fitnessTrackerGlobals.globalValues.userValues.eatenFoodsArrayFriendly,
//            customFoodsArrayFriendly: fitnessTrackerGlobals.globalValues.userValues.customFoodsArrayFriendly
//        }
//    });

//        var customFoods = new Vue({
//            el: '#customFoodList',
//            data: {
//                customFoodsArrayFriendly: fitnessTrackerGlobals.globalValues.userValues.customFoodsArrayFriendly
//            }
//        });

    var vm = new Vue({
        //data: {
            //eatenFoodsArrayFriendly: fitnessTrackerGlobals.globalValues.userValues.eatenFoodsArrayFriendly,
            //customFoodsArrayFriendly: fitnessTrackerGlobals.globalValues.userValues.customFoodsArrayFriendly
      //  }
    });
        
    
// create reusable constructor
//var EatenFoodLog = Vue.extend({
//  template: `<div><p>{{firstName}} {{lastName}} aka {{alias}}</p>
//<li v-for="food in customFoodsArrayFriendly" class="list-group-item" track-by="identifierFoodAttributes.foodUuid">
//
//<p>{{food.descriptiveFoodAttributes.foodname}}
//</li></div>`
//
//})
//// create an instance of Profile
//var eatenFoodLog = new EatenFoodLog({
//  data: {
//    firstName: 'Walter',
//    lastName: 'White',
//    alias: 'Heisenberg',
//    customFoodsArrayFriendly:fitnessTrackerGlobals.globalValues.userValues.customFoodsArrayFriendly
//  }
//})
//// mount it on an element
//eatenFoodLog.$mount('#testComponent')


var EatenFoodLog = Vue.extend({
  template: `<ul class="list-group">
                <div v-if="eatenFoodsArrayFriendly.length !== 0">
                    <li v-for="food in eatenFoodsArrayFriendly" class="list-group-item" track-by="identifierFoodAttributes.foodUuid">
                        <div class="row">
                            <div class="col-sm-10">
                                <button type="button" class="btn btn-primary btn-xs">{{ food.descriptiveFoodAttributes.foodname }} <span class="glyphicon glyphicon-info-sign"></span></button>
                                <br>
                                <div class="label label-info">Primary Macros:</div>
                                <br>
                                <span v-for="attribute in food.primaryFoodAttributes">
                                    <span class="label label-success">{{ $key }}: {{ attribute }}</span>
                                </span>                     
                                <div v-if="food.secondaryFoodAttributes">
                                    <div class="label label-info">Secondary Macros:</div>
                                    <br>
                                    <span v-for="attribute in food.secondaryFoodAttributes">
                                        <span class="label label-success">{{ $key }}: {{ attribute }}</span>
                                    </span>
                                </div>
                            </div>
                            <div class="col-sm-2">
                                <p><button type="button" class="btn btn-default btn-xs pull-right removeFoodButton" data-food-uuid="{{ food.identifierFoodAttributes.foodUuid }}"><span class="glyphicon glyphicon-minus" style="color:red"></span></button></p>
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
            </ul>`
});
// create an instance
var eatenFoodLog = new EatenFoodLog({
  data: {
    eatenFoodsArrayFriendly:fitnessTrackerGlobals.globalValues.friendlyValues.eatenFoodsArrayFriendly
  }
});
// mount it on an element
eatenFoodLog.$mount('eaten-food-log');





var CustomFoodList = Vue.extend({
template: `<ul class="list-group">
              <div v-if="customFoodsArrayFriendly.length !== 0">
                  <li v-for="food in customFoodsArrayFriendly" class="list-group-item" track-by="identifierFoodAttributes.foodUuid">
                      <div class="row">
                          <div class="col-sm-10">
                              <button type="button" class="btn btn-primary btn-xs">{{ food.descriptiveFoodAttributes.foodname }} <span class="glyphicon glyphicon-info-sign"></span></button>
                              <br>
                              <div class="label label-info">Primary Macros:</div>
                              <br>
                              <span v-for="attribute in food.primaryFoodAttributes">
                                  <span class="label label-success">{{ $key }}: {{ attribute }}</span>
                              </span>
                              <br>
                              <div v-if="food.secondaryFoodAttributes">
                                  <div class="label label-info">Secondary Macros:</div>
                                  <br>
                                  <span v-for="attribute in food.secondaryFoodAttributes">
                                      <span class="label label-success">{{ $key }}: {{ attribute }}</span>
                                  </span>
                              </div>
                          </div>
                          <div class="col-sm-2">
                              <p><button type="button" class="btn btn-default btn-xs pull-right eatenCustomFoodButton" data-food-uuid="{{ food.identifierFoodAttributes.foodUuid }}"><span class="glyphicon glyphicon-plus" style="color:green"></span></button></p>
                          </div>
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
            </ul>`
            });
            
            
            // create an instance
var customFoodList = new CustomFoodList({
  data: {
    customFoodsArrayFriendly:fitnessTrackerGlobals.globalValues.friendlyValues.customFoodsArrayFriendly
  }
});
// mount it on an element
customFoodList.$mount('custom-foods');

var SearchResultsFoodList = Vue.extend({
template:             `<ul class="list-group">
                        <div v-if="searchResultsArrayFriendly.length !== 0">
                            <li v-for="food in searchResultsArrayFriendly" class="list-group-item" id="{{ food.identifierFoodAttributes.foodUuid }}" track-by="identifierFoodAttributes.foodUuid">
                                <div class="row">
                                    <div class="col-sm-10">
                                        <button type="button" class="btn btn-primary btn-xs">{{ food.descriptiveFoodAttributes.foodname }} <span class="glyphicon glyphicon-info-sign"></span></button>
                                        <br>
                                        <div class="label label-info">Primary Macros:</div>
                                        <br>
                                        <span v-for="attribute in food.primaryFoodAttributes">
                                            <span class="label label-success">{{ $key }}: {{ attribute }}</span>
                                        </span>
                                        <br>
                                        <div v-if="food.secondaryFoodAttributes">
                                            <div class="label label-info">Secondary Macros:</div>
                                            <br>
                                            <span v-for="attribute in food.secondaryFoodAttributes">
                                                <span class="label label-success">{{ $key }}: {{ attribute }}</span>
                                            </span>
                                        </div>
                                    </div>                
                                    <div class="col-sm-2">
                                        <p><button type="button" class="btn btn-default btn-xs pull-right eatenSearchResultButton" data-food-uuid="{{ food.identifierFoodAttributes.foodUuid }}"><span class="glyphicon glyphicon-plus" style="color:green"></span></button></p>
                                    </div>
                                </div>
                        <div class="row">
                            <div class="col-sm-6 pull-right">
                            <div class='input-group'>
                                <span class='input-group-btn'>
                                    <button class='btn btn-primary decrementWeightButton' type='button' data-food-uuid="{{ food.identifierFoodAttributes.foodUuid }}">-</button>
                                </span>
                                    <input type='number' class='form-control searchResultWeightInput' id="{{ food.identifierFoodAttributes.foodUuid }}-weightinput" data-food-uuid="{{ food.identifierFoodAttributes.foodUuid }}" placeholder='Weight(g)' step='100' min='0' max='100000' value="{{ food.primaryFoodAttributes['Weight (g)'] }}">
                                <span class='input-group-btn'>
                                    <button class='btn btn-primary incrementWeightButton' type='button' data-food-uuid="{{ food.identifierFoodAttributes.foodUuid }}">+</button>
                                </span>
                            </div>
                    </div>
                        </div>
                            </li>
                        </div>
                        <div v-else>
                            <li class="list-group-item">
                                <div class="row">
                                    <div class="col-sm-12">
                                        <h1><small><p class="text-center">Search results will appear here</p></small></h1>
                                    </div>
                                </div>
                            </li>
                        </div>
                      </ul>`
            });
//            
//            + "<button class='btn btn-primary decrementWeightButton' type='button' id='" + currentFoodObject["id_searchablefood"] + "decrementweight" + "'>-</button>"
//                    + "</span>"
//                    + "<input type='number' class='form-control searchresultInput' placeholder='Weight(g)' step='100' min='0' max='100000' id='" + currentFoodObject["id_searchablefood"] + "weight'" + "value='" + currentFoodObject["weight"] + "'>"
//                    + "<span class='input-group-btn'>"
//                    + "<button class='btn btn-primary incrementWeightButton' type='button' id='" + currentFoodObject["id_searchablefood"] + "incrementweight" + "'>+</button>"
//                    + "</span>"
            
            // create an instance
var searchResultsFoodList = new SearchResultsFoodList({
  data: {
    searchResultsArrayFriendly:fitnessTrackerGlobals.globalValues.friendlyValues.searchResultsArrayFriendly
  }
});
// mount it on an element
searchResultsFoodList.$mount('search-results');


});

