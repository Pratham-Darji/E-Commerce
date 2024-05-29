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

function adminPanel() {
  let output = document.getElementById("output");
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
              <div class="buttons">
              <button  onclick="editItem('${e.imageUrl}',  '${e._id}', '${e.name}', '${e.description}', '${e.price}', '${e.type}')"><span class="material-symbols-outlined">
              edit
              </span> Edit</button>
              <button onclick="deleteItem('${e._id}')"><span class="material-symbols-outlined">
              delete
              </span> Delete </button>
              </div>
              
              <p class="addedtocart"></p>
          </div>
        `;
      });
    })
    .catch((err) => {
      console.log(err);
      output.innerHTML = `
        <h1 class="error">Please <a href="./index.html">Login</a> To access this page</h1>`;
    });
}

adminPanel();

// Add Item
function addItem(id) {
  let data = { productId: id };
  apiCall(
    "post",
    "https://e-commerce-hesr.onrender.com/api/users/cartId",
    data
  );
}

// Delete Item
async function deleteItem(id) {
  // console.log(id);
  let data = { productId: id };
  await apiCall(
    "post",
    "https://e-commerce-hesr.onrender.com/api/product/deleteProduct",
    data
  );
  window.location.reload();
}

// Edit Item
async function editItem(imageUrl, id, name, description, price, type) {
  // console.log(id, name, description, price, type);

  output.innerHTML = `
          <div class="card__wrapper">
              <img src="${imageUrl}">
              <span><b>Product: </b><input id="editProductName" type="text" value="${name}"/></span>
              <span><b>Type: </b><input type="text" id="editProductType" value="${type}"/></span>
              <p><b>Description:</b> <input type="textarea" id="editProductDescription" value="${description}"/></p>
              <p><b>Price:</b> <input type="text" id="editProductPrice" value="${price}"/></p>
              
              <div class="buttons">
              <button onclick="window.location.reload()"><span class="material-symbols-outlined">
              cancel
              </span> Cancel </button>
              <button onclick="saveChanges('${id}')"><span class="material-symbols-outlined">
              priority
              </span> Save </button>
              </div>

          </div>
        `;
}

async function saveChanges(id) {
  let name = document.getElementById("editProductName").value;
  let type = document.getElementById("editProductType").value;
  let description = document.getElementById("editProductDescription").value;
  let price = document.getElementById("editProductPrice").value;

  let data = {
    id: id,
    name: name,
    description: description,
    price: price,
    type: type,
  };

  await apiCall(
    "post",
    "https://e-commerce-hesr.onrender.com/api/product/editProduct",
    data
  );
  window.location.reload();
}

async function logout() {
  // let logout = document.getElementById("logout");

  await apiCall("get", "https://e-commerce-hesr.onrender.com/api/users/logout");
  window.location.href = "./index.html";
}

function addProduct() {
  let addProductBtn = document.getElementById("addProduct");
  let addProductDiv = document.getElementById("addProduct__div");
  let submitBtn = document.getElementById("submit-btn");

  addProductBtn.addEventListener("click", function () {
    addProductDiv.classList.toggle("unactive");
  });

  submitBtn.addEventListener("click", function (e) {
    e.preventDefault();
    let productName = document.getElementById("productName").value;
    let productDescription =
      document.getElementById("productDescription").value;
    let productPrice = document.getElementById("productPrice").value;
    let productType = document.getElementById("productType").value;
    let imageUrl = document.getElementById("imageUrl").value;

    if (
      productName &&
      productDescription &&
      productPrice &&
      productType &&
      imageUrl
    ) {
      let Data = {
        productName: productName,
        productDescription: productDescription,
        productPrice: Number(productPrice),
        productType: productType,
        imageUrl: imageUrl,
      };

      apiCall(
        "post",
        "https://e-commerce-hesr.onrender.com/api/users/addProduct",
        Data
      )
        .then((res) => {
          location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}

addProduct();
