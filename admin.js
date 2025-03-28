document.addEventListener('DOMContentLoaded', function() {
    // Check if admin is logged in
    if (isAdmin()) {
        showAdminDashboard();
    } else {
        document.getElementById('login-section').classList.remove('hidden');
    }

    // Setup login form
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Basic admin login (in production, use proper authentication)
        if (username === 'admin' && password === 'catholic123') {
            localStorage.setItem('adminLoggedIn', 'true');
            showAdminDashboard();
        } else {
            alert('Invalid credentials');
        }
    });

    // Setup add product form
    document.getElementById('add-product-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addNewProduct();
    });
});

function isAdmin() {
    return localStorage.getItem('adminLoggedIn') === 'true';
}

function showAdminDashboard() {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.remove('hidden');
    loadProductsTable();
    loadRecentOrders();
}

function logout() {
    localStorage.removeItem('adminLoggedIn');
    window.location.reload();
}

function loadProductsTable() {
    const tableBody = document.getElementById('products-table');
    tableBody.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${product.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$${product.price.toFixed(2)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.category}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="editProduct(${product.id})" class="text-amber-600 hover:text-amber-900 mr-3">Edit</button>
                <button onclick="deleteProduct(${product.id})" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function loadRecentOrders() {
    const ordersList = document.getElementById('orders-list');
    ordersList.innerHTML = '';

    if (orders.length === 0) {
        ordersList.innerHTML = '<p class="text-gray-500">No recent orders</p>';
        return;
    }

    orders.slice(0, 5).forEach(order => {
        const orderItem = document.createElement('div');
        orderItem.className = 'border-b border-gray-200 pb-4';
        orderItem.innerHTML = `
            <div class="flex justify-between">
                <h3 class="text-sm font-medium text-gray-900">Order #${order.id}</h3>
                <span class="text-sm text-gray-500">${new Date(order.date).toLocaleDateString()}</span>
            </div>
            <p class="text-sm text-gray-500 mt-1">${order.items.length} items</p>
            <p class="text-sm font-medium mt-1">$${order.total.toFixed(2)}</p>
        `;
        ordersList.appendChild(orderItem);
    });
}

function showAddProductModal() {
    document.getElementById('add-product-modal').classList.remove('hidden');
}

function hideAddProductModal() {
    document.getElementById('add-product-modal').classList.add('hidden');
    document.getElementById('add-product-form').reset();
}

function addNewProduct() {
    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const category = document.getElementById('product-category').value;
    const image = document.getElementById('product-image').value;

    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name,
        description,
        price,
        category,
        image: image || 'https://via.placeholder.com/800'
    };

    products.push(newProduct);
    hideAddProductModal();
    loadProductsTable();
    alert('Product added successfully!');
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    // In a real app, you would show an edit modal
    const newName = prompt('Enter new product name:', product.name);
    if (newName) {
        product.name = newName;
        loadProductsTable();
    }
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products.splice(index, 1);
            loadProductsTable();
        }
    }
}