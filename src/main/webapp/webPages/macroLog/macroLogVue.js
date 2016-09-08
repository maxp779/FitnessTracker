var macroLogVue = function () {

    var vueComponents = function () {

        var MacroGoals = Vue.extend({
        template:`
<div>
    <div class="row">
        <div class="col-sm-6">
            <div class="panel panel-info">
                <div class="panel-heading"> Proteins</div>
                <div class="panel-body">
                    <p>
                        Protein consumed: {{totalMacrosToday.primaryFoodProperties.protein}} g
                    </p>
                    <p>
                        Protein goal: {{userStats.proteinGoal}} g
                    </p>
                    <p>
                        <div v-if="(userStats.proteinGoal - totalMacrosToday.primaryFoodProperties.protein) >= 0" color="green"> Protein needed: {{userStats.proteinGoal - totalMacrosToday.primaryFoodProperties.protein}} g</div>
                        <div v-else>
                            <p>Protein needed: <span style="color:green;"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Goal met</span></p>
                            <div v-if="((userStats.proteinGoal - totalMacrosToday.primaryFoodProperties.protein) * -1) <=20">
                                <p style="color:green;">You have exceeded your goal by: {{ (userStats.proteinGoal - totalMacrosToday.primaryFoodProperties.protein) * -1}} g</p>
                            </div>
                            <div v-if="((userStats.proteinGoal - totalMacrosToday.primaryFoodProperties.protein) * -1) <=40 && ((userStats.proteinGoal - totalMacrosToday.primaryFoodProperties.protein) * -1) > 20">
                                <p style="color:orange;">You have exceeded your goal by: {{ (userStats.proteinGoal - totalMacrosToday.primaryFoodProperties.protein) * -1}} g</p>
                            </div>
                            <div v-if="((userStats.proteinGoal - totalMacrosToday.primaryFoodProperties.protein) * -1) > 40">
                                <p style="color:red;">You have exceeded your goal by: {{ (userStats.proteinGoal - totalMacrosToday.primaryFoodProperties.protein) * -1}} g</p>
                            </div>
                        </div>
                    </p>
                </div>
            </div>
        </div>
        <div class="col-sm-6">
            <div class="panel panel-info">
                <div class="panel-heading"> Carbohydrates</div>
                <div class="panel-body">
                    <p>
                        Carbs consumed: {{totalMacrosToday.primaryFoodProperties.carbohydrate}} g
                    </p>
                    <p>
                        Carbs goal: {{userStats.carbohydrateGoal}} g
                    </p>
                    <p>
                        <div v-if="(userStats.carbohydrateGoal - totalMacrosToday.primaryFoodProperties.carbohydrate) >= 0" color="blue"> Carbohydrates needed: {{userStats.carbohydrateGoal - totalMacrosToday.primaryFoodProperties.carbohydrate}} g</div>
                        <div v-else>
                            <p>Carbohydrates needed: <span style="color:green;"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Goal met</span></p>
                            <div v-if="((userStats.carbohydrateGoal - totalMacrosToday.primaryFoodProperties.carbohydrate) * -1) <=20">
                                <p style="color:green;">You have exceeded your goal by: {{ (userStats.carbohydrateGoal - totalMacrosToday.primaryFoodProperties.carbohydrate) * -1}} g</p>
                            </div>
                            <div v-if="((userStats.carbohydrateGoal - totalMacrosToday.primaryFoodProperties.carbohydrate) * -1) <=40 && ((userStats.carbohydrateGoal - totalMacrosToday.primaryFoodProperties.carbohydrate) * -1) > 20">
                                <p style="color:orange;">You have exceeded your goal by: {{ (userStats.carbohydrateGoal - totalMacrosToday.primaryFoodProperties.carbohydrate) * -1}} g</p>
                            </div>
                            <div v-if="((userStats.carbohydrateGoal - totalMacrosToday.primaryFoodProperties.carbohydrate) * -1) > 40">
                                <p style="color:red;">You have exceeded your goal by: {{ (userStats.carbohydrateGoal - totalMacrosToday.primaryFoodProperties.carbohydrate) * -1}} g</p>
                            </div>
                        </div>
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-6">
            <div class="panel panel-info">
                <div class="panel-heading"> Fats</div>
                <div class="panel-body">
                    <p>
                        Fats consumed: {{totalMacrosToday.primaryFoodProperties.fat}} g
                    </p>
                    <p>
                        Fats goal: {{userStats.fatGoal}} g
                    </p>
                    <p>
                        <div v-if="(userStats.fatGoal - totalMacrosToday.primaryFoodProperties.fat) > 0" color="orange"> Fats needed: {{userStats.fatGoal - totalMacrosToday.primaryFoodProperties.fat}} g</div>
                        <div v-else>
                            <p>Fats needed: <span style="color:green;"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Goal met</span></p>
                            <div v-if="((userStats.fatGoal - totalMacrosToday.primaryFoodProperties.fat) * -1) <=20">
                                <p style="color:green;">You have exceeded your goal by: {{ (userStats.fatGoal - totalMacrosToday.primaryFoodProperties.fat) * -1}} g</p>
                            </div>
                            <div v-if="((userStats.fatGoal - totalMacrosToday.primaryFoodProperties.fat) * -1) <=40 && ((userStats.fatGoal - totalMacrosToday.primaryFoodProperties.fat) * -1) > 20">
                                <p style="color:orange;">You have exceeded your goal by: {{ (userStats.fatGoal - totalMacrosToday.primaryFoodProperties.fat) * -1}} g</p>
                            </div>
                            <div v-if="((userStats.fatGoal - totalMacrosToday.primaryFoodProperties.fat) * -1) > 40">
                                <p style="color:red;">You have exceeded your goal by: {{ (userStats.fatGoal - totalMacrosToday.primaryFoodProperties.fat) * -1}} g</p>
                            </div>
                        </div>
                    </p>
                </div>
            </div>
        </div>
        <div class="col-sm-6">
            <div class="panel panel-info">
                <div class="panel-heading"> Calories</div>
                <div class="panel-body">
                    <p> Calories consumed: {{totalMacrosToday.primaryFoodProperties.calorie}} kcal</p>
                    <p> Calorie goal: {{userStats.teeGoal}} kcal</p>
                    <p v-if="(userStats.teeGoal - totalMacrosToday.primaryFoodProperties.calorie) >= 0"> Calories needed: {{userStats.teeGoal - totalMacrosToday.primaryFoodProperties.calorie}} kcal</p>
                    <div v-else>
                        <p>Calories needed: <span style="color:green;"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Goal met</span></p>
                        <div v-if="((userStats.teeGoal - totalMacrosToday.primaryFoodProperties.calorie) * -1) <=200">
                            <p style="color:green;">You have exceeded your goal by: {{ (userStats.teeGoal - totalMacrosToday.primaryFoodProperties.calorie) * -1}} g</p>
                        </div>
                        <div v-if="((userStats.teeGoal - totalMacrosToday.primaryFoodProperties.calorie) * -1) <=400 && ((userStats.teeGoal - totalMacrosToday.primaryFoodProperties.calorie) * -1) > 200">
                            <p style="color:orange;">You have exceeded your goal by: {{ (userStats.teeGoal - totalMacrosToday.primaryFoodProperties.calorie) * -1}} g</p>
                        </div>
                        <div v-if="((userStats.teeGoal - totalMacrosToday.primaryFoodProperties.calorie) * -1) > 400">
                            <p style="color:red;">You have exceeded your goal by: {{ (userStats.teeGoal - totalMacrosToday.primaryFoodProperties.calorie) * -1}} g</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`
                });
                
            var AllMacroTotals = Vue.extend({
        template:`
<div>
    <div class="row">
        <div class="col-sm-12">
            <h4><span class="label label-primary">Primary food properties</span></h4>
            <div v-for="property in totalMacrosToday.primaryFoodProperties">
                <span class="label label-info">{{ friendlyFoodProperties[$key] }}: {{ property }}</span> </div>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-12">
          <h4><span class="label label-primary">Secondary food properties</span></h4>
            <div v-for="property in totalMacrosToday.secondaryFoodProperties">
                <span class="label label-info">{{ friendlyFoodProperties[$key] }}: {{ property }}</span> </div>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-12">
          <h4><span class="label label-primary">Vitamins</span></h4>
            <div v-for="property in totalMacrosToday.vitamins">
                <span class="label label-info">{{ friendlyFoodProperties[$key] }}: {{ property }}</span> </div>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-12">
          <h4><span class="label label-primary">Minerals</span></h4>
            <div v-for="property in totalMacrosToday.minerals">
                <span class="label label-info">{{ friendlyFoodProperties[$key] }}: {{ property }}</span> </div>
        </div>
    </div>
</div>
`
});

                return{
                    MacroGoals: MacroGoals,
                    AllMacroTotals:AllMacroTotals
                };
    }();



    var vueFunctions = function () {

        function showMacroGoals() {
            // create an instance
            var macroGoals = new vueComponents.MacroGoals({
                data: {
                    userStats: fitnessTrackerGlobals.globalValues.userValues.userStats,
                    totalMacrosToday: fitnessTrackerGlobals.globalValues.userValues.totalMacrosToday
                }
            });
            // mount it on an element
            macroGoals.$mount('#macroGoals');
        }
        
        function showAllMacroTotals(){
            var allMacroTotals = new vueComponents.AllMacroTotals({
                data: {
                    totalMacrosToday: fitnessTrackerGlobals.globalValues.userValues.totalMacrosToday,
                    friendlyFoodProperties: fitnessTrackerGlobals.globalValues.friendlyValues.friendlyFoodProperties
                }
            });
            allMacroTotals.$mount('#allMacroTotals');
        }
        
        return{
            showMacroGoals:showMacroGoals,
            showAllMacroTotals:showAllMacroTotals
        };
    }();



    //setup vue.js instance
    var vm = new Vue({
    });

    //macroLogVueFunctions functions/variables
    return{
        vueComponents: vueComponents,
        vueFunctions: vueFunctions
    };
}();

