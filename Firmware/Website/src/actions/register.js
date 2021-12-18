import $ from jQuery;

function sendReqForSignup() {
    var email = document.getElementById("email").value;
    var fullName = document.getElementById("fullName").value;
    var password = document.getElementById("password").value;
    var passwordConfirm = document.getElementById("passwordConfirm").value;
    var responseDiv = document.getElementById('ServerResponse');
  
    if (password != passwordConfirm) {
      responseDiv.style.display = "block";
      responseDiv.innerHTML = "<p>Password does not match.</p>";
      return;
    }
    else if (!checkPasswordStrength(password)){
     responseDiv.style.display = "block";
     responseDiv.innerHTML = "<p>Password must be at least 8 characters long and contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character(!@#$%^&).</p>";
     return;
    }
    else if (!validateEmail(email)){
     responseDiv.style.display = "block";
     responseDiv.innerHTML = "<p>Please enter a valid email address.</p>";
     return;
    }
    
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", signUpResponse);
    xhr.responseType = "json";
    xhr.open("POST", '/users/register');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify({email:email,fullName:fullName, password:password}));
  }
  
  function signUpResponse() {
     var responseDiv = document.getElementById('ServerResponse');
    // 200 is the response code for a successful GET request
    if (this.status === 201) {
      if (this.response.success) {
        // Change current location to the signin page.
        window.location = "index.html";
      } 
      else {
        responseHTML += "<ol class='ServerResponse'>";
        for (key in this.response) {
          responseHTML += "<li> " + key + ": " + this.response[key] + "</li>";
        }
        responseHTML += "</ol>";
      }
    }
    else {
      // Use a span with dark red text for errors
      responseHTML = "<span class='red-text text-darken-2'>";
      responseHTML += "Error: " + this.response.message;
      responseHTML += "</span>"
    }
  
    // Update the response div in the webpage and make it visible
    responseDiv.style.display = "block";
    responseDiv.innerHTML = responseHTML;
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("signup").addEventListener("click", sendReqForSignup);
  });