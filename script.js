document.addEventListener('DOMContentLoaded', function() {
    // Load products
    renderProducts();
    
    // Initialize cart count
    updateCartCount();
});

function renderProducts() {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900">${product.name}</h3>
                <p class="text-gray-600 mt-1">${product.description}</p>
                <div class="mt-4 flex justify-between items-center">
                    <span class="text-lg font-bold text-amber-600">$${product.price.toFixed(2)}</span>
                    <button onclick="addToCart(${product.id})" class="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition-colors">
                        <i class="fas fa-cart-plus mr-2"></i>Add to Cart
                    </button>
                </div>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartCount();
    alert(`${product.name} added to cart!`);
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

// Checkout functionality
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const order = {
        items: [...cart],
        total,
        status: 'pending'
    };

    // Simulate order processing
    setTimeout(() => {
        orders.push(order);
        cart = [];
        updateCartCount();
        alert('Thank you for your order! Your items will be shipped soon.');
    }, 1000);
}

// Basic admin check
function isAdmin() {
    return localStorage.getItem('adminLoggedIn') === 'true';
}

// Stripe payment integration
const stripe = Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
let elements;

async function initializeStripeCheckout() {
    const response = await fetch('/create-payment-intent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            amount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        }),
    });
    const { clientSecret } = await response.json();

    const appearance = {
        theme: 'stripe',
    };
    elements = stripe.elements({ appearance, clientSecret });

    const paymentElement = elements.create('payment');
    paymentElement.mount('#payment-element');
}

async function handleStripeSubmit() {
    const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
            return_url: 'http://localhost:3000/order-complete.html',
        },
    });

    if (error) {
        alert(error.message);
    }
}