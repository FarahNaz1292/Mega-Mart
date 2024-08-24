const showAllButton = document.getElementById("showAllBtn");
let total = 0;
const fetchProducts = async (inputValue, isShowAll) => {
  let input = inputValue ? inputValue : "";
  // console.log(inputValue);
  const response = await fetch(
    `https://dummyjson.com/products/search?q=${input}`
  );
  const data = await response.json();
  const products = data.products;
  loadProducts(products, isShowAll);
};
const searchProduct = (isShowAll) => {
  const inputValue = document.getElementById("productName").value;
  // console.log(inputValue);
  fetchProducts(inputValue, isShowAll);
};
const sortItemByName = async () => {
  const response = await fetch(`https://dummyjson.com/products?sortBy=title`);
  const data = await response.json();
  const products = data.products;
  loadProducts(products);
};
const handleSortByPrice = async (sortOrder) => {
  const response = await fetch(
    `https://dummyjson.com/products?sortBy=price&order=${sortOrder}`
  );
  const data = await response.json();
  const products = data.products;
  console.log(products);
  loadProducts(products);
};
const priceOrder = document.querySelectorAll(".dropdown-item");
priceOrder.forEach((items) => {
  items.addEventListener("click", (e) => {
    e.preventDefault();
    const sortOrder = items.getAttribute("value");
    console.log(sortOrder);

    handleSortByPrice(sortOrder);
  });
});

const loadProducts = (products, isShowAll) => {
  if (products.length > 6 && !isShowAll) {
    showAllButton.classList.remove("d-none");
  } else {
    showAllButton.classList.add("d-none");
  }
  if (!isShowAll) {
    products = products.slice(0, 6);
  }
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";
  products.forEach((product) => {
    const div = document.createElement("div");
    const productTitle = product.title;
    const productDescription = product.description;
    div.classList = "col mb-3";
    div.innerHTML = `
<div class="card" style="width:300px; row-gap:10px">
  <img src=${
    product.thumbnail
  } class="card-img-top" alt="..." style="width:300px; height:200px;align-items:center; justify-content:center">
  <div class="card-body shadow-lg">
    <h5 class="card-title">${
      productTitle.length > 10
        ? productTitle.substring(0, 10).concat("...more")
        : productTitle
    }</h5>
    <p class="card-text">${productDescription}</p>
    <p class="product-price fw-bold">$${product.price}</p>
       <button onclick="handleDetails(${
         product.id
       })" type="button" class="btn w-100 fw-bold text-white" data-bs-toggle="modal" data-bs-target="#exampleModal" style="background-color:#00afb9; border: none;height: 50px;" >
               View Details
            </button>
  </div>
</div>
`;
    cardContainer.appendChild(div);
  });
};
const handleDetails = async (id) => {
  const res = await fetch(`https://dummyjson.com/products/${id}`);
  const data = await res.json();
  displayModals(data);
};
const displayModals = (product) => {
  const modalConatiner = document.getElementById("modal-container");
  modalConatiner.innerHTML = "";
  const div = document.createElement("div");
  div.innerHTML = `
  <div style="width:120px; display:flex; align-content:center; justify-items:center; margin-left:75px">
        <img src= "${product.thumbnail}" alt="">
  </div>
  <p class="fw-bolder" id="title">${product.title} <span></span></p>
     <p class="fw-bolder">Price:$<span id="price">${product.price}</span></p>
    <p class="fw-bolder">Availabilty:${product.availabilityStatus}</p>
    <p class="fw-bolder">Ratings:${product.rating} </p> 

  
`;
  modalConatiner.appendChild(div);
};
const showAll = () => {
  searchProduct(true);
};
const handleAddToCart = (target) => {
  const cartContainer = document.getElementById("cart-container");
  const subTotal = document.getElementById("subTotal");
  const grandTotal = document.getElementById("total");
  const productName =
    target.parentNode.parentNode.childNodes[1].childNodes[3].childNodes[0]
      .childNodes[3].innerText;
  const productprice = Number(
    target.parentNode.parentNode.childNodes[1].childNodes[3].childNodes[0]
      .childNodes[5].childNodes[1].innerText
  );
  const li = document.createElement("li");
  li.innerHTML = productName;
  cartContainer.appendChild(li);
  total += productprice;
  subTotal.innerHTML = total.toFixed(2);
  grandTotal.innerHTML = total.toFixed(2);
  if (total >= 75) {
    couponButton.removeAttribute("disabled");
  }
};
const couponButton = document.getElementById("coupon-btn");
const couponValue = document.getElementById("couponCode");
const discountedTotal=document.getElementById("discount")
const grandTotal = document.getElementById("total");
couponButton.addEventListener("click", () => {
  const coupon = couponValue.value;
  if (coupon === "PROMO20") {
    const discountedPrice = total * (0.2);
    discountedTotal.innerHTML = discountedPrice.toFixed(2);
    grandTotal.innerHTML = (total - discountedPrice).toFixed(2);
  }
});

fetchProducts();
document.getElementById("refreshPage").addEventListener("click", () => {
  window.location.reload(true);
});
