let loginBtn = document.getElementById("login-btn");
let registrationBtn = document.getElementById("registration-btn");

let loginForm = document.getElementById("login__form");
let registrationForm = document.getElementById("registration__form");

let loggedIn = false;
let data;

// Onclick Login Logic
loginBtn.addEventListener("click", function () {
  if (loginBtn.classList.contains("active")) return;
  loginBtn.classList.add("active");

  if (registrationBtn.classList.contains("active")) {
    registrationBtn.classList.remove("active");
  }

  if (loginForm.classList.contains("unactive")) {
    loginForm.classList.remove("unactive");
    registrationForm.classList.add("unactive");
  }
});

// Onclick registration Logic
registrationBtn.addEventListener("click", function () {
  if (registrationBtn.classList.contains("active")) return;
  registrationBtn.classList.add("active");
  if (loginBtn.classList.contains("active")) {
    loginBtn.classList.remove("active");
    0;
  }

  if (registrationForm.classList.contains("unactive")) {
    loginForm.classList.add("unactive");
    registrationForm.classList.remove("unactive");
  }
});

// Now Checking the credentials
function apiCall(method, url, data) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          let resData = xhr.responseText;
          resolve(JSON.parse(resData));
          loggedIn = true;
        } else {
          reject(xhr.responseText);
        }
      }
    };

    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));
  });
}

function login() {
  let username = document.getElementById("login-username").value;
  let password = document.getElementById("login-password").value;

  accessError = document.getElementById("error");

  if (!username && !password) {
    accessError.innerText = "Enter Username or Password";
  }
  if (username && password) {
    data = {
      username: username,
      password: password,
    };

    apiCall(
      "post",
      "https://e-commerce-hesr.onrender.com/api/users/login",
      data
    )
      .then((message) => {
        // console.log(message);
        loggedIn = true;
        let role = message.loggedInUserRole;
        console.log(role);
        if (role == "user") {
          window.location.href = "./home.html";
        }

        if (role == "admin") {
          window.location.href = "./admin-panel.html";
        }
      })
      .catch((error) => {
        setTimeout(function () {
          accessError.innerText = "Invalid Username or Password";
        }, 3000);

        console.log(error);
      });
  }
}

//
// Logic for registration
function registration() {
  let name = document.getElementById("registration-name").value;
  let email = document.getElementById("registration-email").value;
  let phone = document.getElementById("registration-phone").value;
  let username = document.getElementById("registration-username").value;
  let password = document.getElementById("registration-password").value;

  let success = document.getElementById("registerSuccess");
  let regerror = document.getElementById("registerError");

  if (!name && !email && !phone && !username && !password) {
    success.innerText = `Please Fill Out All the Fields`;
  }

  if (name && email && phone && username && password) {
    let data = {
      name: name,
      email: email,
      phone: phone,
      username: username,
      password: password,
    };
    apiCall(
      "post",
      "https://e-commerce-hesr.onrender.com/api/users/register",
      data
    )
      .then((message) => {
        console.log(message);

        success.innerText = `Registration Successfull`;
      })
      .catch((error) => {
        console.log(error);
        regerror.innerText = `${error}`;
      });
  }
}
