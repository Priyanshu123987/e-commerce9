const products = [
  { id: 1, name: "T-Shirt", price: 499, category: "clothing", image: "https://via.placeholder.com/200x150?text=T-Shirt" },
  { id: 2, name: "Jeans", price: 1299, category: "clothing", image: "https://via.placeholder.com/200x150?text=Jeans" },
  { id: 3, name: "Sneakers", price: 1999, category: "shoes", image: "https://via.placeholder.com/200x150?text=Sneakers" },
  { id: 4, name: "Watch", price: 899, category: "accessories", image: "https://via.placeholder.com/200x150?text=Watch" },
  { id: 5, name: "Cap", price: 299, category: "accessories", image: "https://via.placeholder.com/200x150?text=Cap" },
  { id: 6, name: "Jacket", price: 1599, category: "clothing", image: "https://via.placeholder.com/200x150?text=Jacket" }
];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
function displayProducts(list) {
  const container = document.getElementById("product-list");
  container.innerHTML = "";
  if (list.length === 0) {
    container.innerHTML = "<p>No products found!</p>";
    return;
  }
  list.forEach(p => {
    const inWishlist = wishlist.find(item => item.id === p.id);
    const heart = inWishlist ? "❤️" : "🤍";
    container.innerHTML += `
      <div class="product">
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
        <button onclick="toggleWishlist(${p.id})">${heart}</button>
      </div>
    `;
  });
  applyThemeToProducts();
}
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const item = cart.find(p => p.id === id);
  if (item) item.quantity++;
  else cart.push({ ...product, quantity: 1 });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cartCount").textContent = count;
}
function openCart() {
  document.getElementById("cartModal").style.display = "block";
  renderCart();
}
function closeCart() {
  document.getElementById("cartModal").style.display = "none";
}
function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty!</p>";
    cartTotal.textContent = "";
    return;
  }
  let total = 0;
  cartItems.innerHTML = "";
  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    cartItems.innerHTML += `
      <div>
        <img src="${item.image}" width="50">
        ${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}
        <button onclick="removeFromCart(${index})">Remove</button>
      </div>
    `;
  });
  cartTotal.textContent = `Total: ₹${total}`;
}
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}
function clearCart() {
  cart = [];
  localStorage.removeItem("cart");
  renderCart();
  updateCartCount();
}
function applyFilters() {
  const searchValue = document.getElementById("searchBox").value.toLowerCase();
  const categoryValue = document.getElementById("categoryFilter").value;
  const sortValue = document.getElementById("sortFilter").value;
  let filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchValue) &&
    (categoryValue === "all" || p.category === categoryValue)
  );
  if (sortValue === "low-high") filtered.sort((a, b) => a.price - b.price);
  else if (sortValue === "high-low") filtered.sort((a, b) => b.price - a.price);
  displayProducts(filtered);
}
function toggleWishlist(id) {
  const product = products.find(p => p.id === id);
  const index = wishlist.findIndex(p => p.id === id);
  if (index > -1) wishlist.splice(index, 1);
  else wishlist.push(product);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateWishlistCount();
  displayProducts(products);
}
function openWishlist() {
  document.getElementById("wishlistModal").style.display = "block";
  renderWishlist();
}
function closeWishlist() {
  document.getElementById("wishlistModal").style.display = "none";
}
function renderWishlist() {
  const wishlistItems = document.getElementById("wishlistItems");
  if (wishlist.length === 0) {
    wishlistItems.innerHTML = "<p>Your wishlist is empty!</p>";
    return;
  }
  wishlistItems.innerHTML = "";
  wishlist.forEach((item, index) => {
    wishlistItems.innerHTML += `
      <div>
        <img src="${item.image}" width="50">
        ${item.name} - ₹${item.price}
        <button onclick="addToCart(${item.id})">Add to Cart</button>
        <button onclick="removeFromWishlist(${index})">Remove</button>
      </div>
    `;
  });
}
function removeFromWishlist(index) {
  wishlist.splice(index, 1);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  renderWishlist();
  updateWishlistCount();
  displayProducts(products);
}
function clearWishlist() {
  wishlist = [];
  localStorage.removeItem("wishlist");
  renderWishlist();
  updateWishlistCount();
}
function updateWishlistCount() {
  document.getElementById("wishlistCount").textContent = wishlist.length;
}
function toggleTheme() {
  const body = document.body;
  const header = document.querySelector("header");
  const modalContents = document.querySelectorAll(".modal-content");
  const button = document.getElementById("themeToggle");
  const isDark = body.classList.toggle("dark");
  header.classList.toggle("dark");
  modalContents.forEach(m => m.classList.toggle("dark"));
  document.querySelectorAll(".product").forEach(p => p.classList.toggle("dark"));
  document.querySelectorAll("button").forEach(btn => btn.classList.toggle("dark"));
  button.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("theme", isDark ? "dark" : "light");
}
function applyThemeToProducts() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark");
    document.querySelector("header").classList.add("dark");
    document.querySelectorAll(".product").forEach(p => p.classList.add("dark"));
    document.querySelectorAll("button").forEach(btn => btn.classList.add("dark"));
    document.querySelectorAll(".modal-content").forEach(m => m.classList.add("dark"));
    document.getElementById("themeToggle").textContent = "☀️ Light Mode";
  }
}
displayProducts(products);
updateCartCount();
updateWishlistCount();
applyThemeToProducts();