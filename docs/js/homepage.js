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

function homepage() {
  let output = document.getElementById("output");
  let cartNumber = document.getElementById("cart_number");
  apiCall("get", "https://e-commerce-hesr.onrender.com/api/product/data")
    .then((message) => {
      message.forEach((e) => {
        output.innerHTML += `
        <div class="card__wrapper">
            <img src="${e.imageUrl}">
            <span><b>Product: </b>${e.name}</span>
            <span><b>Type: </b>${e.type}</span>
            <p><b>Description:</b> ${e.description}</p>
            <p><b>Price:</b> ₹${e.price}</p>
            <button class="addBtn" id="addBtn-${e._id}" onclick="addItem('${e._id}')">Add</button>
            
        </div>
      `;
      });

      apiCall("get", "https://e-commerce-hesr.onrender.com/api/users/viewCart")
        .then((message) => {
          let totalQty = 0;
          message.forEach((e) => {
            totalQty += e.product.Qty;
          });

          // console.log(totalQty);
          cartNumber.innerHTML = `${totalQty}`;
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
      output.innerHTML = `
      <h1 id="h1">Please <a href="./index.html">Login</a> To access this page</h1>`;
    });
}

homepage();

function addItem(id) {
  // console.log(id);
  let addedtocart = document.getElementById(`addedtocart-${id}`);
  let addBtn = document.getElementById(`addBtn-${id}`);
  let cartNumber = document.getElementById("cart_number");

  let data = { productId: id };
  apiCall(
    "post",
    "https://e-commerce-hesr.onrender.com/api/users/cartId",
    data
  ).then((message) => {
    // console.log(message);

    addBtn.innerText = "Item Added Successfully";
    (addBtn.style.backgroundColor = "white"), (addBtn.style.color = "green");
    setTimeout(function () {
      addBtn.innerText = "Add";
      (addBtn.style.backgroundColor = "#03112e"),
        (addBtn.style.color = "white");
    }, 2000);

    apiCall("get", "https://e-commerce-hesr.onrender.com/api/users/viewCart")
      .then((message) => {
        let totalQty = 0;
        message.forEach((e) => {
          totalQty += e.product.Qty;
        });
        // console.log(totalQty);
        cartNumber.innerHTML = `${totalQty}`;
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

function logout() {
  let logout = document.getElementById("logout");

  logout.addEventListener("click", async function () {
    await apiCall(
      "get",
      "https://e-commerce-hesr.onrender.com/api/users/logout"
    );
    window.location.href = "./index.html";
  });
}

logout();
