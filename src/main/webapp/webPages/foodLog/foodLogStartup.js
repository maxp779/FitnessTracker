$(document).ready(function () {

    fitnessTrackerGlobals.commonFunctions.setupNavbar();
    foodLogEvents.setupAllEvents();

});

/**
 * Fix for multiple modal scroll issue
 * 
 * Without this when opening a second modal within a modal. Scrolling will be broken
 * on the first modal when closing the second.
 * 
 * Code aquired from here:
 * http://stackoverflow.com/questions/19305821/multiple-modals-overlay
 * 
 * @param {type} param1
 * @param {type} param2
 * @param {type} param3
 */
$(document).on('hidden.bs.modal', '.modal', function () {
    $('.modal:visible').length && $(document.body).addClass('modal-open');
});