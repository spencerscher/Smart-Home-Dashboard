import $ from jQuery;

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('signout').addEventListener('click', function() {
       window.localStorage.removeItem("authToken");
       window.location = "index.html";
    });
 });