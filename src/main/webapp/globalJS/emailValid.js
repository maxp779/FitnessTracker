/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//$(document).ready(function () {
//
//    $('#confirmNewEmail').on('keyup', function (event) {
//        if ($('#newEmail').val() != '' && $('#confirmNewEmail').val() != '' && $('#newEmail').val() != $('#confirmNewEmail').val())
//        {
//            $('#emailValidNotifier').removeClass().addClass('alert alert-danger').html('Email does not match!');
//            emailValid = false;
//        } else
//        {
//            $('#emailValidNotifier').removeClass().html('');
//            emailValid = true;
//        }
//
//    });
//
//});

function emailMatchValidator(emailID, confirmEmailID, feedbackDivID)
{
    emailID = "#" + emailID;
    confirmEmailID = "#" + confirmEmailID;
    $(confirmEmailID).on('keyup', function (event) {
        if ($(emailID).val() != '' && $(confirmEmailID).val() != '' && $(emailID).val() != $(confirmEmailID).val())
        {
            //$('#emailValidNotifier').removeClass().addClass('alert alert-danger').html('Email does not match!');
            document.getElementById(feedbackDivID).innerHTML = "<div class='alert alert-danger'>Emails do not match</div>";
            fitnessTrackerGlobals.globalValues.miscValues.emailValid = false;
        } else
        {
            //$('#emailValidNotifier').removeClass().html('');
            document.getElementById(feedbackDivID).innerHTML = "";
            fitnessTrackerGlobals.globalValues.miscValues.emailValid = true;
        }

    });
}

//function submitIfEmailValid()
//{
//    return emailValid;
//}

