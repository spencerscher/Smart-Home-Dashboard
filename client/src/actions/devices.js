import $ from jquery;

function sendReqForDeviceInfo() {
    $.ajax({
        url: '/devices/all',
        type: 'GET',
        headers: { 'x-auth': window.localStorage.getItem("authToken") },
        responseType: 'json',
        success: deviceInfoSuccess,
        error: deviceInfoError
    });
 }
 
 function deviceInfoSuccess(data, textSatus, jqXHR) {
    //clear device list
    $("#devices").empty();
    // Add the devices to the list before the list item for the add device button (link)
    for (var device of data.devices) {
       //add devices
        console.log(device.deviceId);
        var newDevice = $("#deviceTemplate").clone().attr("id", device.deviceId);
        newDevice.find(".deviceName").html(device.deviceId);
        newDevice.find(".deviceId").html(device.deviceId);
        newDevice.find(".apiKey").html(device.apikey);
        newDevice.find(".lastCont").html((new Date(device.lastContact)).toLocaleString('en-us'));
        $("#devices").append(newDevice);
    }
    $(".deleteButton").click(openModal);
 }
 
 function deviceInfoError(data, textSatus, jqXHR) {
    // If authentication error, delete the authToken 
    // redirect user to sign-in page (which is index.html)
    if( data.status === 401 ) {
        console.log("Invalid auth token");
        window.localStorage.removeItem("authToken");
        window.location.replace("index.html");
    } 
    else {
        $("#error").html("Error: " + data.message);
        $("#error").show();
    } 
 }
 function registerDevice() {
    $.ajax({
        url: '/devices/register',
        type: 'POST',
        headers: { 'x-auth': window.localStorage.getItem("authToken") },   
        data: { deviceId: $("#deviceId").val() }, 
        responseType: 'json',
        success: function (data, textStatus, jqXHR) {
          M.toast({html: 'Successfully Added Device'});
          sendReqForDeviceInfo();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            var response = JSON.parse(jqXHR.responseText);
            M.toast({html: 'Failed Adding Device'});
            $("#error").html("Error: " + response.message);
            $("#error").show();
        }
    }); 
 }
 
 function sendReqToDeleteDevice() {
    $.ajax({
        url: '/devices/remove/'+$("#modalDevId").html(),
        type: 'DELETE',
        headers: { 'x-auth': window.localStorage.getItem("authToken") },
        responseType: 'json',
        success: deleteDeviceSuccess,
        error: deleteDeviceError
    });
 }
 
 function deleteDeviceSuccess(data, textSatus, jqXHR) {
    //Refresh device list
    sendReqForDeviceInfo();
 }
 
 function deleteDeviceError(data, textSatus, jqXHR) {
    // If authentication error, delete the authToken 
    // redirect user to sign-in page (which is index.html)
    if( data.status === 401 ) {
        console.log("Invalid auth token");
        window.localStorage.removeItem("authToken");
        window.location.replace("index.html");
    } 
    else {
        $("#error").html("Error: " + data.message);
        $("#error").show();
    } 
 }
 
 function openModal() {
    var id = $(this).parents(".col").attr("id");
    console.log(id);
    $("#modalDevId").html(id)
    $('#deleteModal').modal('open'); 
 }
 
 // Handle authentication on page load
 $(function() {
    // If there's no authToekn stored, redirect user to 
    // the sign-in page (which is index.html)
    if (!window.localStorage.getItem("authToken")) {
        window.location.replace("index.html");
    }
    else {
       sendReqForDeviceInfo();
       sendReqForDeviceInfo();
    }
 
    // Register event listeners
    $("#registerDevice").click(registerDevice);
    $("#deleteConfirm").click(sendReqToDeleteDevice)
    $('#deleteModal').modal();
    $("#error").hide();
 });