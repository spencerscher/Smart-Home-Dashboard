import $ from jQuery;

function sendReqForSignin() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", signinResponse);
    xhr.responseType = "json";
    xhr.open("POST", '/users/signin');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify({email:email, password:password}));
  }
  
  function signinResponse() {
    // 200 is the response code for a successful GET request
    if (this.status === 201) {
       window.localStorage.setItem("authToken", this.response.token);
       window.location = "home.html";
    }
    else {
      // Use a span with dark red text for errors
      var responseDiv = document.getElementById("ServerResponse");
      var responseHTML = "<span class='red-text text-darken-2'>";
      responseHTML += "Error: " + this.response.error;
      responseHTML += "</span>"
      responseDiv.innerHTML = responseHTML;
      responseDiv.style.display = "block";
    }
  
    // Update the response div in the webpage and make it visible
    responseDiv.style.display = "block";
    responseDiv.innerHTML = responseHTML;
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    if( window.localStorage.getItem("authToken")) {
      window.location.replace("home.html");
    }
    else {
       document.getElementById("signin").addEventListener("click", sendReqForSignin);
       document.getElementById("password").addEventListener("keypress", function(event) {
          var key = event.which || event.keyCode;
          if( key === 13 ) {
             sendReqForSignin();
          }
       });
     }
  });