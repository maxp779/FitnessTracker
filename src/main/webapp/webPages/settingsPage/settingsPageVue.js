var settingsPageVue = function (){
    
    var vueComponents = function(){
        
        var SelectedPropertyForm = Vue.extend({
  template: `<form id='editSelectedPropertiesForm' role='form'>

</form>

<ul class='nav nav-tabs' id="selectedPropertyTabs" role=tablist>
    <li role="presentation" class="active">
        <a href='#primaryFoodProperties' role="tab" data-toggle="tab" aria-controls='primaryFoodProperties'>Primary food properties</a>
    </li>
    <li role="presentation">
        <a href='#secondaryFoodProperties' role="tab" data-toggle="tab" aria-controls='secondaryFoodProperties'>Secondary food properties</a>
    </li>
    <li role="presentation">
        <a href='#vitamins' role="tab" data-toggle="tab" aria-controls='vitamins'>Vitamins</a>
    </li>
    <li role="presentation">
        <a href='#minerals' role="tab" data-toggle="tab" aria-controls='minerals'>Minerals</a>
    </li>
</ul>


<div class="tab-content" id="selectedPropertyTabsContent">
    <div class="tab-pane active" role="tabpanel" id='primaryFoodProperties'>
        <div class="row">
            <div class="col-sm-12">
                <h3>Primary food properties</h3>
                <div v-for='property in standardFoodObject.primaryFoodProperties'>
                    <label class="checkbox-inline">
                        <input form='editSelectedPropertiesForm' id='{{ $key }}checkbox' name='{{ $key }}' type="checkbox" value='{{ $key }}'>{{friendlyFoodProperties[$key]}}</label>
                </div>
            </div>
        </div>
    </div>
    <div class="tab-pane" role="tabpanel" id='secondaryFoodProperties'>
        <div class="row">
            <div class="col-sm-12">
                <h3>Secondary food properties</h3>
                <div v-for='property in standardFoodObject.secondaryFoodProperties'>
                    <label class="checkbox-inline">
                        <input form='editSelectedPropertiesForm' id='{{ $key }}checkbox' name='{{ $key }}' type="checkbox" value='{{ $key }}'>{{friendlyFoodProperties[$key]}}</label>
                </div>
            </div>
        </div>
    </div>
    <div class="tab-pane" role="tabpanel" id='vitamins'>
        <div class="row">
            <div class="col-sm-12">
                <h3>Vitamins</h3>
                <div v-for='property in standardFoodObject.vitamins'>
                    <label class="checkbox-inline">
                        <input form='editSelectedPropertiesForm' id='{{ $key }}checkbox' name='{{ $key }}' type="checkbox" value='{{ $key }}'>{{friendlyFoodProperties[$key]}}</label>
                </div>
            </div>
        </div>
    </div>
    <div class="tab-pane" role="tabpanel" id='minerals'>
        <div class="row">
            <div class="col-sm-12">
                <h3>Minerals</h3>
                <div v-for='property in standardFoodObject.minerals'>
                    <label class="checkbox-inline">
                        <input form='editSelectedPropertiesForm' id='{{ $key }}checkbox' name='{{ $key }}' type="checkbox" value='{{ $key }}'>{{friendlyFoodProperties[$key]}}</label>
                </div>
            </div>
        </div>
    </div>
</div>

<button id="saveSelectedPropertiesButton" type="submit" class="btn btn-primary spacer" form="editSelectedPropertiesForm">Save property changes</button>
<div id="propertyFeedback" class="spacer"></div>
`});
        
        //vueComponents
        return{
            SelectedPropertyForm:SelectedPropertyForm
        };
    }();
    
    
    
    
    $(document).ready(function () {
        var loadVueComponents = function() {
            // create an instance
            var selectedPropertyForm = new vueComponents.SelectedPropertyForm({
                replace:false,
                data: {
                    friendlyFoodProperties: fitnessTrackerGlobals.globalValues.friendlyValues.friendlyFoodProperties,
                    selectedFoodProperties:fitnessTrackerGlobals.globalValues.userValues.selectedFoodProperties,
                    standardFoodObject:fitnessTrackerGlobals.serverApi.standardFoodObject
                }
            });           
            selectedPropertyForm.$mount('#selectFoodPropertiesComponent');               
        }();
    });
            
    //setup vue.js instance
    var vm = new Vue({
    
    });
    
    //settingsPageVue
    return{
        
    };
}();