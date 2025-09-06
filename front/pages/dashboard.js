export function Dashboard() {
    const div = document.createElement("div");
    div.classList.add("dashboard-root"); // <-- biar CSS nempel
    div.innerHTML = `
    <div class="saldo">
        <h5 class="balance"></h5>
        <button class="recharge">Recharge</button>
    </div>
    <div class="btnContainer">
        <button class="addNewProduct">Add New</button>
        <button class="saveProducts">Save</button>
        <button class="viewSavedFiles">View files</button>
        <button class="deleteAllProducts">Delete All</button>
    </div>

    <div class="productList">
        <div class="productListHeader">
            <h2>Product List</h2>
            <h2 class="total">Total: NT$ 0</h2>
        </div>
        <ul class="products"></ul>
    </div>

    <footer>
        <h5 style="text-align: center; font-size: 12px; color: #888; margin-top: 20px; bottom: 0;">
            &copy; 2025 Rose&Eldjie. All rights reserved.
        </h5>
    </footer>
  `;

    //fetch balance
    const balanceElement = div.querySelector(".balance");
    async function fetchBalance() {
        try {
            const response = await fetch('api/saldo');
            const result = await response.json();
            if (response.ok) {
                const saldo = result.data.saldo !== undefined
                    ? result.data.saldo
                    : (result.data && result.data[0] && result.data[0].saldo) || 0;
                balanceElement.textContent = `Balance: NT$ ${saldo}`;
            } else {
                balanceElement.textContent = 'Error fetching balance';
                console.error('Error fetching balance:', result.error);
            }
        } catch (error) {
            balanceElement.textContent = 'Error fetching balance';
            console.error('Network error:', error);
        }
    }
    fetchBalance();

    //recharge balance
    const rechargeButton = div.querySelector(".recharge");
    rechargeButton.addEventListener("click", () => {
        const amount = prompt("Enter recharge amount (NT$):");
        const parsedAmount = parseFloat(amount);
        if (!isNaN(parsedAmount) && parsedAmount > 0) {
            fetch('api/saldo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ saldo: parsedAmount })
            })
                .then(response => response.json())
                .then(result => {
                    if (result.message) {
                        alert(result.message);
                        fetchBalance();
                    } else if (result && result.error) {
                        alert('Error recharging balance: ' + result.error);
                    } else {
                        alert('Error recharging balance: Unknown error');
                    }
                })
                .catch(error => {
                    alert('Network error: ' + error.message);
                });
        } else {
            alert('Invalid amount');
        }
    });

    //fetch products
    const productsUl = div.querySelector(".products");
    const totalElement = div.querySelector(".total");
    async function fetchProducts() {
        try {
            const response = await fetch('api/products');
            const result = await response.json();
            if (response.ok && Array.isArray(result.product)) {
                productsUl.innerHTML = "";
                let total = 0; // ✅ reset total setiap kali fetch
                result.product.forEach(item => {
                    const li = document.createElement("li");
                    li.innerHTML = `<span class="productName">${item.name}</span>
                                    <span class="date">${item.date}</span>
                                    <span class="productPrice">NT$ ${item.price}</span>
                                    <span class="deleteProduct" data-id="${item.id}">🗑️</span>`;
                    productsUl.appendChild(li);
                    total += item.price;

                    //delete product
                    const deleteButton = li.querySelector(".deleteProduct");
                    deleteButton.addEventListener("click", async () => {
                        const id = deleteButton.getAttribute("data-id");
                        try {
                            const response = await fetch(`api/products/${id}`, {
                                method: 'DELETE'
                            });
                            const result = await response.json();
                            if (response.ok) {
                                alert('Product deleted successfully');
                                fetchProducts();
                                fetchBalance();
                            } else {
                                alert('Error deleting product: ' + result.error);
                            }
                        } catch (error) {
                            alert('Network error: ' + error.message);
                        }
                    });
                });
                totalElement.textContent = `Total: NT$ ${total}`;
            } else {
                productsUl.innerHTML = '<li>No products found</li>';
            }
        } catch (error) {
            productsUl.innerHTML = '<li>Error fetching products</li>';
            console.error('Network error:', error);
        }
    }
    fetchProducts();

    function fetchAndUpdate() {
        fetchProducts();
        fetchBalance();
    }
    // Initial fetch
    setInterval(fetchAndUpdate, 5000); // Update every 5 seconds

    //add new product
    const addButton = div.querySelector(".addNewProduct");
    addButton.addEventListener("click", () => {
        const modal = document.createElement("div");
        modal.classList.add("modal");
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2>Add New Product</h2>
                <form class="addProductForm">
                    <label for="name">Product Name:</label>
                    <input type="text" id="name" name="name" required />
                    <label for="price">Price:</label>
                    <input type="number" id="price" name="price" required />
                    <label for="date">Date:</label>
                    <input type="date" id="date" name="date" required />
                    <button type="submit">Add Product</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        const closeButton = modal.querySelector(".close-button");
        closeButton.addEventListener("click", () => {
            document.body.removeChild(modal);
        });

        const form = modal.querySelector(".addProductForm");
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = form.name.value;
            const price = parseFloat(form.price.value);
            const date = form.date.value;

            try {
                const response = await fetch('api/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, price, date })
                });
                const result = await response.json();
                if (response.ok) {
                    alert('Product added successfully');
                    document.body.removeChild(modal);
                    fetchProducts();
                    fetchBalance();
                } else {
                    alert('Error adding product: ' + result.error);
                }
            } catch (error) {
                alert('Network error: ' + error.message);
            }
        });
    });

    //save to file
    const saveButton = div.querySelector(".saveProducts");
    saveButton.addEventListener("click", () => {
        const div = document.createElement("div");
        div.classList.add("modal");
        div.innerHTML = `
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2>Save Products</h2>
                <form class="saveProductForm">
                    <input type="text" class="fileName" placeholder="Enter file name" required />
                    <button type="submit" class="confirm-save">Save</button>
                    <button type="button" class="cancel-save">Cancel</button>
                </form>
                <div class="preview">
                    <h3>Preview:</h3>
                    <div class="previewContent">
                        ${productsUl.innerHTML}
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(div);

        const closeButton = div.querySelector(".close-button");
        closeButton.addEventListener("click", () => {
            document.body.removeChild(div);
        });

        const cancelButton = div.querySelector(".cancel-save");
        cancelButton.addEventListener("click", () => {
            document.body.removeChild(div);
        });

        const form = div.querySelector(".saveProductForm");
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const fileName = form.querySelector('.fileName').value || 'products';

            const products = [];
            productsUl.querySelectorAll("li").forEach(li => {
                const name = li.querySelector(".productName").textContent;
                const date = li.querySelector(".date").textContent;
                const priceText = li.querySelector(".productPrice").textContent;
                const price = parseFloat(priceText.replace('NT$ ', ''));
                products.push({ name, date, price });
            });

            try {
                const response = await fetch('api/products/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ fileName, products })
                });
                const result = await response.json();
                if (response.ok) {
                    alert('Products saved successfully');
                    document.body.removeChild(div);
                } else {
                    alert('Error saving products: ' + result.error);
                }
            } catch (error) {
                alert('Network error: ' + error.message);
            }
        });
    });

    //view saved files
    const viewFilesButton = div.querySelector(".viewSavedFiles");
    viewFilesButton.addEventListener("click", async () => {
        const div = document.createElement("div");
        div.classList.add("modal");
        div.innerHTML = `
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2>Saved Files</h2>
                <ul class="savedFilesList"></ul>
            </div>
        `;
        document.body.appendChild(div);

        const closeButton = div.querySelector(".close-button");
        closeButton.addEventListener("click", () => {
            document.body.removeChild(div);
        });

        const savedFilesList = div.querySelector(".savedFilesList");

        try {
            const response = await fetch('api/products/saved');
            const result = await response.json();
            if (response.ok) {
                savedFilesList.innerHTML = "";
                result.files.forEach(file => {
                    const li = document.createElement("li");
                    li.innerHTML = `<span class="fileName">${file.name}</span>
                                    <span class="viewfile" data-id="${file.id}"></span>
                                    <span class="deletefile" data-id="${file.id}">🗑️</span>`;
                    savedFilesList.appendChild(li);

                    //view saved file details
                    const viewButton = document.createElement("span");
                    viewButton.classList.add("viewfile");
                    viewButton.setAttribute("data-id", file.id);
                    viewButton.textContent = "View details";
                    li.appendChild(viewButton);
                    viewButton.addEventListener("click", async () => {
                        const id = viewButton.getAttribute("data-id");
                        try {
                            const response = await fetch(`api/products/saved/${id}`);
                            const result = await response.json();
                            if (response.ok) {
                                const previewDiv = document.createElement("div");
                                previewDiv.classList.add("modal");
                                let previewContent = `<div class="modal-content">
                                    <span class="close-button">&times;</span>
                                    <h2>File: ${result.file.name}</h2>
                                    <ul>`;
                                result.file.data.forEach(item => {
                                    previewContent += `<li>
                                        <span class="productName">${item.name}</span>
                                        <span class="date">${item.date}</span>
                                        <span class="productPrice">NT$ ${item.price}</span>
                                    </li>`;
                                });
                                previewContent += `</ul></div>`;
                                previewDiv.innerHTML = previewContent;
                                document.body.appendChild(previewDiv);

                                const closeButton = previewDiv.querySelector(".close-button");
                                closeButton.addEventListener("click", () => {
                                    document.body.removeChild(previewDiv);
                                });
                            } else {
                                alert('Error fetching file details: ' + result.error);
                            }
                        } catch (error) {
                            alert('Network error: ' + error.message);
                        }
                    });

                    //delete saved file
                    const deleteButton = li.querySelector(".deletefile");
                    deleteButton.addEventListener("click", async () => {
                        const id = deleteButton.getAttribute("data-id");
                        try {
                            const response = await fetch(`api/products/saved/${id}`, {
                                method: 'DELETE'
                            });
                            const result = await response.json();
                            if (response.ok) {
                                alert('File deleted successfully');
                                li.remove();
                            } else {
                                alert('Error deleting file: ' + result.error);
                            }
                        } catch (error) {
                            alert('Network error: ' + error.message);
                        }
                    });
                });
            } else {
                savedFilesList.innerHTML = '<li>Error fetching saved files</li>';
                console.error('Error fetching saved files:', result.error);
            }
        } catch (error) {
            savedFilesList.innerHTML = '<li>Error fetching saved files</li>';
            console.error('Network error:', error);
        }
    });

    //delete all products
    const deleteAllButton = div.querySelector(".deleteAllProducts");
    deleteAllButton.addEventListener("click", async () => {
        if (confirm("Are you sure you want to delete all products? This action cannot be undone.")) {
            try {
                const response = await fetch('api/products', {
                    method: 'DELETE'
                });
                const result = await response.json();
                if (response.ok) {
                    alert('All products deleted successfully');
                    fetchProducts();
                    fetchBalance();
                } else {
                    alert('Error deleting all products: ' + result.error);
                }
            } catch (error) {
                alert('Network error: ' + error.message);
            }
        }
    });

    return div;
}