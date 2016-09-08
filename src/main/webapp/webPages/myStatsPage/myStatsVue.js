var myStatsVue = function () {

    var vueComponents = function () {

        var MacroComponent = Vue.extend({
            template:  `<div>
                            <p>
                                <font color="green">Daily protein: {{macroObject.proteinGoal}}</font>
                            </p>
                            <p>
                                <font color="blue">Daily carbohydrates: {{macroObject.carbohydrateGoal}}</font>
                            </p>
                            <p>
                                <font color="orange">Daily fats: {{macroObject.fatGoal}}</font>
                            </p>
                            <hr>
                            <p>Calories from protein: {{macroObject.proteinGoal * 4}}</p>
                            <p>Calories from carbohydrates: {{macroObject.carbohydrateGoal * 4}}</p>
                            <p>Calories from fats: {{macroObject.fatGoal * 9}}</p>
                            <p>Total daily calories: {{macroObject.teeGoal}}</p>
                        </div>`
        });
        //vueComponents components
        return{
            MacroComponent: MacroComponent

        };
    }();


    $(document).ready(function () {
        var loadVueComponents = function () {
            
            // create an instance
            var macroComponent = new vueComponents.MacroComponent({
                data: {
                    macroObject: fitnessTrackerGlobals.globalValues.userValues.userStats
                }
            });
            // mount it on an element
            macroComponent.$mount('#currentMacroGoal');

        }();
    });
    
    var vueFunctions = function(){
        
        function createCalculatedMacroComponent()
        {
            var calculatedMacroComponent = new vueComponents.MacroComponent({
                data: {
                    macroObject: fitnessTrackerGlobals.globalValues.tempValues.tempUserStatsCalculated
                }
            });
            // mount it on an element
            calculatedMacroComponent.$mount('#calculatedMacros');
        }
        
        
        return{
            createCalculatedMacroComponent:createCalculatedMacroComponent
        };      
    }();

    var vm = new Vue({
    });

    //foodLogVueFunctions functions/variables
    return{
        vueComponents: vueComponents,
        vueFunctions:vueFunctions
    };
}();