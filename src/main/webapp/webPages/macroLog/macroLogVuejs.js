var macroLogVueFunctions = function () {

    var vueComponents = function(){
        
        var MacroGoals = Vue.extend({
  template: `<p><font color="green">Protein needed:</font></p>
            <p><font color="blue">Carbs needed:</font></p>
            <p><font color="orange">Fats needed:</font></p>
            <hr>
            <p>Calories needed:</p>`});
    
    return{
        MacroGoals:MacroGoals
    }
    
    }();
    
    
    $(document).ready(function () {
        var loadVueComponents = function() {
            // create an instance
            var macroGoals = new vueComponents.MacroGoals({
                data: {
                    userStats: fitnessTrackerGlobals.globalValues.userValues.userStats
                }
            });
            // mount it on an element
            foodInfoList.$mount('#currentMacros');

        }();
    });
    
    //setup vue.js instance
    var vm = new Vue({
    });
     
    //macroLogVueFunctions functions/variables
    return{
        vueComponents:vueComponents
    };
}();

