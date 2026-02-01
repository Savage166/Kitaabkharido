// --- SHOPPING CART LOGIC ---
let cart = JSON.parse(localStorage.getItem('kitaabCart')) || [];

function updateCartCount() {
    const countElement = document.getElementById('cart-count');
    if(countElement) {
        countElement.innerText = cart.length;
    }
}

function addToCart(bookName, price) {
    cart.push({ name: bookName, price: price });
    localStorage.setItem('kitaabCart', JSON.stringify(cart));
    updateCartCount();
    
    // Add a simple animation feedback
    const btn = event.currentTarget;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Added';
    btn.classList.remove('btn-grad');
    btn.classList.add('btn-success');
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.add('btn-grad');
        btn.classList.remove('btn-success');
    }, 1500);
}

// --- SEARCH BAR LOGIC ---
function filterBooks() {
    // 1. Get the search query
    let input = document.getElementById('searchInput').value.toLowerCase();
    
    // 2. Get all book cards
    let books = document.getElementsByClassName('book-item');
    let hasResults = false;

    // 3. Loop through books and hide/show based on query
    for (let i = 0; i < books.length; i++) {
        // We get the text content of the whole card (Title, Author, Class)
        let cardContent = books[i].innerText.toLowerCase();
        
        if (cardContent.includes(input)) {
            books[i].style.display = "block"; // Show
            hasResults = true;
        } else {
            books[i].style.display = "none"; // Hide
        }
    }

    // 4. Show "No Results" message if needed
    let noResultMsg = document.getElementById('no-result');
    if (noResultMsg) {
        noResultMsg.style.display = hasResults ? "none" : "block";
    }
}

// --- CHECKOUT LOGIC (Only runs on checkout page) ---
function loadCheckout() {
    const list = document.getElementById('cart-items-list');
    const totalEl = document.getElementById('cart-total');
    
    if (!list) return; // Exit if not on checkout page

    if (cart.length === 0) {
        list.innerHTML = '<li class="list-group-item text-center text-muted p-4">Your cart is empty. <br><a href="index.html">Go Shopping</a></li>';
        totalEl.innerText = '₹0';
        return;
    }

    list.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        let li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            <span><i class="fa-solid fa-book text-muted me-2"></i>${item.name}</span>
            <div>
                <span class="badge bg-primary rounded-pill me-2">₹${item.price}</span>
                <button class="btn btn-sm btn-outline-danger border-0" onclick="removeFromCart(${index})"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        list.appendChild(li);
    });

    totalEl.innerText = '₹' + total;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('kitaabCart', JSON.stringify(cart));
    loadCheckout();
    updateCartCount();
}

function processOrder(event) {
    event.preventDefault();
    if(cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    const myModal = new bootstrap.Modal(document.getElementById('orderModal'));
    myModal.show();
    cart = [];
    localStorage.setItem('kitaabCart', JSON.stringify(cart));
    loadCheckout();
    updateCartCount();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    loadCheckout(); // Safe to call even if not on checkout page
});
