/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var jsessionid;
function jsessionidSetup() {
//here we get the jsessionID if there is one and attach it to the end of each link
    var currentURL = window.location.href;
    var jsessionidSearchParameter = ";jsessionid=";
    var jsessionidLocation = currentURL.search(jsessionidSearchParameter);
    jsessionid = "";
    if (jsessionidLocation === -1)
    {
        //no jSessionID found
    }
    else
    {
        jsessionid = currentURL.substring(jsessionidLocation);
    }

    //add jsessionid to all elements with the class "jsessionid"
    var list = document.getElementsByClassName("jsessionid");
    for (i = 0; i < list.length; i++)
    {
        var currentItem = list[i];
        
        //add jsessionid to links
        if (currentItem.hasOwnProperty("href"))
        {
            currentItem.href = currentItem.href + jsessionid;
        }
        
        //add jsessionid to forms
        if (currentItem.hasOwnProperty("action"))
        {
            currentItem.action = currentItem.action + jsessionid;
        }
    }
}
;