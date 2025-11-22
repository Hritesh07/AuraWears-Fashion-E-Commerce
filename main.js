'use strict';

/* -----------------------------
   PRODUCT DATA
----------------------------- */
const PRODUCTS = [
  { id: 1, title: "Short Sleeve Shirt", price: 170, img: "./assets/images/product-1.png", desc: "Comfortable cotton shirt." },
  { id: 2, title: "Dead Sunglasses", price: 210, img: "./assets/images/product-2.png", desc: "Premium sunglasses with UV protection." },
  { id: 3, title: "Studios Trouser", price: 90, img: "./assets/images/product-3.png", desc: "Smart casual trousers with durable stitching." },
  { id: 4, title: "Acne Baseball Cap", price: 80, img: "./assets/images/product-4.png", desc: "Minimal and aesthetic baseball cap." },
  { id: 5, title: "Garcons Parfums", price: 190, img: "./assets/images/product-6.png", desc: "Luxury fragrance with a lasting fresh aroma." },
  { id: 6, title: "Salomon Sneaker", price: 450, img: "./assets/images/product-7.png", desc: "High-performance sneaker with premium comfort." },
  { id: 7, title: "Ribbed Beanie Hat", price: 120, img: "./assets/images/product-8.png", desc: "Warm winter beanie with ribbed texture." },
  { id: 8, title: "Acronym Khaki", price: 220, img: "./assets/images/product-9.png", desc: "Urban street-style khaki pants." }
];

/* -----------------------------
   CART STORAGE
----------------------------- */
const CART_KEY = "aurawears_cart_v1";

function readCart(){
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch(e){ return []; }
}

function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(id, qty = 1){
  const cart = readCart();
  const existing = cart.find(i => i.id === id);
  if(existing){ existing.qty += qty; }
  else { cart.push({ id, qty }); }
  saveCart(cart);
}

function removeFromCart(id){
  saveCart(readCart().filter(i => i.id !== id));
}

function updateQty(id, qty){
  const cart = readCart();
  const item = cart.find(i => i.id === id);
  if(!item) return;
  if(qty <= 0){ removeFromCart(id); return; }
  item.qty = qty;
  saveCart(cart);
}

function clearCart(){ saveCart([]); }

/* -----------------------------
   CART COUNT
----------------------------- */
function updateCartCount(){
  const total = readCart().reduce((t,i)=>t+i.qty,0);
  document.querySelectorAll("#cart-count, #cart-count-contact, #cart-count-checkout")
    .forEach(el => el && (el.textContent = `Cart (${total})`));
}

/* -----------------------------
   RENDER HOME
----------------------------- */
function renderHomeProducts(){
  const container = document.getElementById("home-products");
  if(!container) return;

  container.innerHTML = "";
  PRODUCTS.slice(0,3).forEach(p=>{
    container.innerHTML += `
      <li class="scrollbar-item">
        <div class="product-card text-center">
          <div class="card-banner">
            <figure class="product-banner img-holder" style="--width:448;--height:470;">
              <img src="${p.img}" class="img-cover" />
            </figure>
            <a href="#" class="btn product-btn" data-add="${p.id}">
              <ion-icon name="bag"></ion-icon>
              <span class="span">Add To Cart</span>
            </a>
          </div>
          <div class="card-content">
            <h3 class="h4 title"><a href="product.html?id=${p.id}">${p.title}</a></h3>
            <span class="price">$${p.price.toFixed(2)}</span>
          </div>
        </div>
      </li>`;
  });
}

/* -----------------------------
   SHOP PAGE
----------------------------- */
function renderShopPage(){
  const container = document.getElementById("shop-products");
  if(!container) return;

  container.innerHTML = "";
  PRODUCTS.forEach(p=>{
    container.innerHTML += `
      <div class="product-grid-item card">
        <figure class="img-holder" style="--width:448;--height:470;">
          <img src="${p.img}" class="img-cover" />
        </figure>
        <div class="card-content">
          <h3 class="h4"><a href="product.html?id=${p.id}">${p.title}</a></h3>
          <p class="card-text">${p.desc}</p>
          <div class="card-row">
            <span class="price">$${p.price}</span>
            <button class="btn" data-add="${p.id}">Add to Cart</button>
          </div>
        </div>
      </div>`;
  });
}

/* -----------------------------
   PRODUCT DETAILS
----------------------------- */
function renderProductDetail(){
  const container = document.getElementById("product-detail");
  if(!container) return;

  const id = parseInt(new URLSearchParams(location.search).get("id"));
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p){ container.innerHTML = "<p>Product Not Found</p>"; return; }

  container.innerHTML = `
    <div class="product-detail-left">
      <figure class="img-holder" style="--width:548;--height:548;">
        <img src="${p.img}" class="img-cover" />
      </figure>
    </div>
    <div class="product-detail-right">
      <h1 class="title">${p.title}</h1>
      <p class="price">$${p.price.toFixed(2)}</p>
      <p class="card-text">${p.desc}</p>
      <div class="product-actions">
        <label>Qty</label>
        <input type="number" id="detail-qty" min="1" value="1" />
        <button class="btn btn-primary" id="detail-add">Add to Cart</button>
      </div>
    </div>`;

  document.getElementById("detail-add").onclick = () => {
    const qty = parseInt(document.getElementById("detail-qty").value);
    addToCart(p.id, qty);
    alert("Item added to cart!");
  };
}

/* -----------------------------
   CART PAGE
----------------------------- */
function renderCartPage(){
  const container = document.getElementById("cart-items");
  const summary = document.getElementById("cart-summary");
  if(!container || !summary) return;

  const cart = readCart();
  container.innerHTML = "";
  summary.innerHTML = "";

  if(!cart.length){
    container.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  let total = 0;

  cart.forEach(item=>{
    const p = PRODUCTS.find(pr=>pr.id===item.id);
    const lineTotal = p.price * item.qty;
    total += lineTotal;

    container.innerHTML += `
      <div class="cart-line">
        <div class="cart-left"><img src="${p.img}" width="80"></div>
        <div class="cart-middle">
          <h4>${p.title}</h4>
          <p>$${p.price} × <input type="number" min="1" value="${item.qty}" data-qty="${p.id}" /></p>
        </div>
        <div class="cart-right">
          <strong>$${lineTotal.toFixed(2)}</strong>
          <button class="btn" data-remove="${p.id}">Remove</button>
        </div>
      </div>`;
  });

  summary.innerHTML = `<h3>Order Summary</h3><p>Total: $${total.toFixed(2)}</p>`;

  container.querySelectorAll("[data-remove]").forEach(btn=>{
    btn.onclick = ()=>{ removeFromCart(parseInt(btn.dataset.remove)); renderCartPage(); };
  });

  container.querySelectorAll("[data-qty]").forEach(inp=>{
    inp.onchange = ()=>{ updateQty(parseInt(inp.dataset.qty), parseInt(inp.value)); renderCartPage(); };
  });
}

/* -----------------------------
   ORDER ID
----------------------------- */
function generateOrderId(){
  return `AW-${Date.now()}-${Math.floor(Math.random()*900+100)}`;
}

/* -----------------------------
   WEB3FORMS BACKEND (FIXED)
----------------------------- */
const WEB3_KEY = "bca101e2-47e4-4b5d-960d-4f057b90234b";
const OWNER_EMAIL = "crigo0216@gmail.com";

async function sendOrderEmail(order){
  const items = order.items.map(i=>`- ${i.title} x${i.qty} = $${(i.qty*i.price).toFixed(2)}`).join("\n");

  const payload = {
    access_key: WEB3_KEY,
    from_name: order.customer.name,
    from_email: order.customer.email,
    subject: "New Order: " + order.id,
    message: `
Order ID: ${order.id}

Name: ${order.customer.name}
Email: ${order.customer.email}
Phone: ${order.customer.phone}
Address: ${order.customer.address}

Items:
${items}

Total: $${order.total.toFixed(2)}
`
  };

  return fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify(payload)
  }).then(r=>r.json());
}

async function sendContactEmail({name,email,message}){
  const payload = {
    access_key: WEB3_KEY,
    from_name: name,
    from_email: email,
    subject: "Contact Message",
    message: `Name: ${name}\nEmail: ${email}\n\n${message}`
  };

  return fetch("https://api.web3forms.com/submit",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify(payload)
  }).then(r=>r.json());
}

async function sendSubscribeEmail(email){
  const payload = {
    access_key: WEB3_KEY,
    from_name: "Subscriber",
    from_email: email,
    subject: "New Subscriber",
    message: `New subscriber: ${email}`
  };

  return fetch("https://api.web3forms.com/submit",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify(payload)
  }).then(r=>r.json());
}

/* -----------------------------
   FORMS
----------------------------- */
function setupForms(){

  /* CONTACT */
  const contact = document.getElementById("contact-form");
  if(contact){
    contact.addEventListener("submit", async e=>{
      e.preventDefault();
      const name = document.getElementById("c-name").value;
      const email = document.getElementById("c-email").value;
      const message = document.getElementById("c-message").value;

      const res = await sendContactEmail({name,email,message});
      alert(res.success ? "Message sent!" : "Failed to send.");
      contact.reset();
    });
  }

  /* CHECKOUT */
  const checkout = document.getElementById("checkout-form");
  if(checkout){
    checkout.addEventListener("submit", async e=>{
      e.preventDefault();

      const cart = readCart();
      if(!cart.length) return alert("Cart is empty!");

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const address = document.getElementById("address").value;
      const phone = document.getElementById("phone").value;

      if(!name || !email || !address || !phone){
        return alert("Please fill all fields.");
      }

      let items = [];
      let total = 0;

      cart.forEach(ci=>{
        const p = PRODUCTS.find(x=>x.id===ci.id);
        items.push({title:p.title, qty:ci.qty, price:p.price});
        total += p.price * ci.qty;
      });

      const order = {
        id: generateOrderId(),
        customer: {name,email,address,phone},
        items,
        total
      };

      const res = await sendOrderEmail(order);

      alert(res.success ? "Order placed successfully!" : "Order saved but email failed.");

      clearCart();
      window.location = "index.html";
    });
  }
}

/* -----------------------------
   NAVIGATION
----------------------------- */
function setupNavigation(){
  document.body.addEventListener("click", e=>{
    if(e.target.closest("#cart-button, #cart-button-checkout, #cart-button-contact")){
      e.preventDefault();
      window.location = "cart.html";
    }

    const add = e.target.closest("[data-add]");
    if(add){
      e.preventDefault();
      addToCart(parseInt(add.dataset.add));
      updateCartCount();
      alert("Added to cart!");
    }
  });
}

/* -----------------------------
   INIT
----------------------------- */
function init(){
  renderHomeProducts();
  renderShopPage();
  renderProductDetail();
  renderCartPage();
  setupForms();
  setupNavigation();
  updateCartCount();
}

document.addEventListener("DOMContentLoaded", init);
