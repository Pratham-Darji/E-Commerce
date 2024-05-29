function apiCall(method, url, data) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          let resData = xhr.responseText;
          resolve(JSON.parse(resData));
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

function personalInfo() {
  let output = document.getElementById("output");
  let symbol = document.getElementById("div-symbol");
  apiCall("get", "https://e-commerce-hesr.onrender.com/api/users/userInfo")
    .then((message) => {
      if (message.role == "admin") {
        symbol.innerHTML = `
        <span class="material-symbols-outlined" id="personInfo">
        <a href="./admin-panel.html"> Home </a>
      </span>
      <h2>Check Out</h2>
      <span class="material-symbols-outlined">
        
        <a  id="logout" onclick="logout()">logout</a>
      </span>
        `;
      }

      if (message.role == "user") {
        symbol.innerHTML = `
        <span class="material-symbols-outlined" id="personInfo">
          <a href="./home.html"> Home </a>
        </span>
        <h2>Check Out</h2>
        <span class="material-symbols-outlined">
        <a href="./view-cart.html"
          >shopping_cart</a
        >
        <a id="logout" onclick="logout()">logout</a>
        </span>
        `;
      }

      output.innerHTML = `
      <div class="output__wrapper">
        <p>username: ${message.name}</p>
        <p>email: ${message.email}</p>
        <p>phone: ${message.phone}</p>
      </div>
      `;
    })
    .catch((err) => {
      console.log(err);
      output.innerHTML = `
        <h1 class="error">Please <a href="./index.html">Login</a> To access this page</h1>`;
    });
}

personalInfo();

async function logout() {
  let logout = document.getElementById("logout");

  await apiCall("get", "https://e-commerce-hesr.onrender.com/api/users/logout");
  window.location.href = "./index.html";
}
