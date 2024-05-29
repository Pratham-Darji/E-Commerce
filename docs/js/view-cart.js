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

async function viewCart() {
  let allData = [];
  let selectedId = [];
  let output = document.getElementById("output");
  await apiCall(
    "get",
    "https://e-commerce-hesr.onrender.com/api/users/viewCart"
  )
    .then((message) => {
      message.forEach((e) => {
        selectedId.push(e);
      });

      // console.log(selectedId);
    })
    .catch((err) => {
      console.log(err);
      output.innerHTML = `
        <h1>Please <a href="./index.html">Login</a> To access this page</h1> `;
    });

  await apiCall(
    "get",
    "https://e-commerce-hesr.onrender.com/api/product/data",
    {}
  )
    .then((message) => {
      message.forEach((e) => {
        allData.push(e);
      });
    })
    .catch((err) => {
      console.log(err);
      output.innerHTML = `
        <h1 id="h1">Please <a href="./index.html">Login</a> To access this page</h1> `;
    });

  if (selectedId == 0) {
    output.innerHTML = `
    <img src="./images/empty-cart.png" alt="empty-cart image">
    `;
  } else {
    selectedId.forEach((e) => {
      let productId = e.product.productId;
      let qty = e.product.Qty;
      allData.forEach((j) => {
        if (j._id == productId) {
          // console.log(e);
          output.innerHTML += `
              <div class="card__wrapper">
                  <img src="${j.imageUrl}">
                  <span><b>Product: </b>${j.name}</span>
                  <span><b>Type: </b>${j.type}</span>
                  <p><b>Description:</b> ${j.description}</p>
                  <div class="price-qty">
                    <p><b>Price:</b> ₹${j.price} </p>
                    <p><b>Qty:</b> ${qty}</p>
                  </div>
                  
                  <div class="buttons">
                  <button class="addBtn" id="payBtn">Pay Total ₹${
                    j.price * qty
                  }</button>
                  <button class="addBtn" id="dltBtn" onclick="deleteFunc('${productId}')">Delete Product</button>
                  </div>
              </div>
            `;
        }
      });
    });
  }
}

viewCart();

async function deleteFunc(id) {
  let data = { productId: id };
  // console.log(data);
  await apiCall(
    "post",
    "https://e-commerce-hesr.onrender.com/api/users/deleteQty",
    data
  );
  window.location.reload();
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
