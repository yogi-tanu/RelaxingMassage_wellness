document.getElementById('name').value = '';
import { dbRef, ref, child, get, db, set, remove, update, onAuthStateChanged, auth, signOut } from "./config.js";
var data;
const signOutBtn = document.getElementById('signOutBtn');
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("openModalBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function () {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

signOutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        console.log('Sign-out successful.');
        // Add any additional actions after sign-out here
    }).catch((error) => {
        console.error('Sign-out error:', error);
    });
});
var button
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        get(child(dbRef, `/`)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
                data = snapshot.val();
                renderFoodItems();

            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });


        document.getElementById('productForm').addEventListener('submit', function (event) {
            event.preventDefault();

            // Get form values
            const name = document.getElementById('name').value;
            const price = parseFloat(document.getElementById('price').value);
            const type = document.getElementById('type').value;

            // Here you can perform further validation and processing
            console.log('Name:', name);
            console.log('Price:', price);
            console.log('Type:', type);
            const date = Date.now();
            console.log(date);
            set(ref(db, 'food/' + type + '/' + date), {
                name: name,
                price: price,
            })
                .then(() => {
                    // Data saved successfully!
                    console.log("scuesss");
                    addFoodItem(name, price, type, date)

                })
                .catch((error) => {
                    // The write failed...
                    console.log(error)
                });
            // Clear form inputs
            document.getElementById('name').value = '';
            document.getElementById('price').value = '';
            document.getElementById('type').value = '';
        });


        // ...
    } else {
        // User is signed out
        // ...
        console.log("you are logged out")
        location.href = "./login.html"
    }
});



function renderFoodItems() {
    const foodTableBody = document.getElementById('foodTableBody');
    foodTableBody.innerHTML = ''; // Clear previous items

    Object.keys(data.food).forEach(category => {
        const items = data.food[category];

        // Create a new row for the category
        const categoryRow = foodTableBody.insertRow();
        categoryRow.classList.add('category-row');

        // Create a cell for the category name
        const categoryCell = categoryRow.insertCell();
        categoryCell.colSpan = 4; // Span across all columns
        categoryCell.textContent = category;
        categoryCell.classList.add('category-cell');
        categoryRow.id = category;
        

        Object.keys(items).forEach(key => {
            const item = items[key];

            // Create a new row for the food item
            const newRow = foodTableBody.insertRow();

            // Insert cells for name, price, delete button, and modify button
            const nameCell = newRow.insertCell();
            const priceCell = newRow.insertCell();
            const deleteCell = newRow.insertCell();
            const modifyCell = newRow.insertCell();

            // Set content for name and price cells
            nameCell.textContent = item.name;
            priceCell.textContent = `$${item.price}`;
            newRow.id = key;
            // Create delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
            </svg>`;
            deleteBtn.classList.add('btn', 'btn-delete');

            // Create modify button
            const modifyBtn = document.createElement('button');
            modifyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
            </svg>`;
            modifyBtn.classList.add('btn', 'btn-modify');

            // Add event listeners to delete and modify buttons
            deleteBtn.addEventListener('click', () => deleteItem(category, key));
            modifyBtn.addEventListener('click', () => modifyItem(category, key,item.name,item.price));

            // Append buttons to delete and modify cells
            deleteCell.appendChild(deleteBtn);
            modifyCell.appendChild(modifyBtn);
        });
    });
}

// Function to render food items
// function renderFoodItems() {
//     const foodList = document.getElementById('foodList');
//     foodList.innerHTML = ''; // Clear previous items

//     Object.keys(data.food).forEach(category => {
//         // Create food type heading
//         const typeHeading = document.createElement('h1');
//         typeHeading.textContent = category;
//         typeHeading.id = category;
//         typeHeading.classList.add('food-type');
//         foodList.appendChild(typeHeading);

//         // Create list of items
//         const items = data.food[category];
//         Object.keys(items).forEach(key => {
//             const item = items[key];
//             const div = document.createElement('div');
//             div.classList.add('food-item');
//             div.id = key;

//             const itemName = document.createElement('span');
//             itemName.textContent = item.name;

//             const itemPrice = document.createElement('span');
//             itemPrice.textContent = `$${item.price}`;

//             const deleteBtn = document.createElement('button');
//             deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
//             <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
//             <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
//           </svg>`;
//             deleteBtn.classList.add('btn', 'btn-delete',);

//             const modifyBtn = document.createElement('button');
//             modifyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
//             <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
//           </svg>`;
//             modifyBtn.classList.add('btn', 'btn-modify');

//             deleteBtn.addEventListener('click', () => deleteItem(category, key));
//             modifyBtn.addEventListener('click', () => modifyItem(category, key));

//             const detailsDiv = document.createElement('div');
//             detailsDiv.classList.add('food-details');
//             detailsDiv.appendChild(itemName);
//             detailsDiv.appendChild(itemPrice);
//             detailsDiv.appendChild(deleteBtn);
//             detailsDiv.appendChild(modifyBtn);

//             div.appendChild(detailsDiv);

//             foodList.appendChild(div);
//         });
//     });
// }

function addFoodItem(name, price, type, date) {
    // Find the food list container
    const foodTable = document.getElementById('foodTableBody');

    // Find the category row
    const categoryRow = document.getElementById(type);

    if (categoryRow) {
        // Create a new food item row
        const newRow = document.createElement('tr');
        newRow.id = date;

        // Create table cells for name, price, and buttons
        const nameCell = document.createElement('td');
        nameCell.textContent = name;

        const priceCell = document.createElement('td');
        priceCell.textContent = `$${price}`;

        const deleteBtnCell = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('btn', 'btn-delete');
        deleteBtn.addEventListener('click', () => deleteItem(type, key)); // Assuming you have a deleteItem function
        deleteBtnCell.appendChild(deleteBtn);

        const modifyBtnCell = document.createElement('td');
        const modifyBtn = document.createElement('button');
        modifyBtn.textContent = 'Modify';
        modifyBtn.classList.add('btn', 'btn-modify');
        modifyBtn.addEventListener('click', () => modifyItem(type, key, name, price)); // Assuming you have a modifyItem function
        modifyBtnCell.appendChild(modifyBtn);

        // Append cells to the new row
        newRow.appendChild(nameCell);
        newRow.appendChild(priceCell);
        newRow.appendChild(deleteBtnCell);
        newRow.appendChild(modifyBtnCell);

        // Insert the new food item row below the category row
        var parent = categoryRow.parentNode;
        if (parent) {
            parent.insertBefore(newRow, categoryRow.nextSibling);
        }
    } else {
        console.error(`Category row for "${type}" not found.`);
    }
}


// Function to delete an item
function deleteItem(category, key) {
    // Implement deletion logic here

    console.log(`Deleting item from category "${category}" with key "${key}"`);
    const dbRef = ref(db, "food/" + category + "/" + key);

    // Call the remove() function to delete the data
    remove(dbRef);
    // Find the corresponding DOM element
    const itemToDelete = document.getElementById(key);

    // Remove the item from the UI
    if (itemToDelete) {
        itemToDelete.parentElement.removeChild(itemToDelete);
    }
}

// Function to modify an item
// function modifyItem(category, key) {
//     const itemDiv = document.getElementById(key);
//     const itemPriceSpan = itemDiv.querySelector('.food-details > span:nth-child(2)');
//     const newPrice = prompt('Enter the new price:');

//     if (newPrice !== null) {
//         // Update the price in the UI
//         itemPriceSpan.textContent = `$${newPrice}`;

//         // Update the price in the database
//         const itemRef = ref(db, `food/${category}/${key}`);


//         console.log(category);
//         // updating firebase 
//         update(ref(db, 'food/' + category + '/' + key), {

//             price: newPrice,
//         })
//             .then(() => {
//                 // Data saved successfully!
//                 console.log("scuesss");

//             })
//             .catch((error) => {
//                 // The write failed...
//                 console.log(error)
//             });
//     }

// }
// Get the modify modal
var modifyModal = document.getElementById("modifyModal");

// Get the button that opens the modify modal
var modifyBtn = document.getElementById("submitModifyBtn");

// When the user clicks the button to modify an item, open the modify modal 
function modifyItem(category, key, name, price) {
    const itemDiv = document.getElementById(key);
    const itemPriceSpan = itemDiv.querySelector(' td:nth-child(2)');
    const itemPriceSpan1 = itemDiv.querySelector(' td:nth-child(1)');

    const newPrice = document.getElementById('newPriceInput');
    const newName = document.getElementById('newNameInput');
    newName.value = name;
    newPrice.value = price;
    console.log(price);

    // When the user clicks the modify button, open the modify modal
    modifyBtn.onclick = function () {


        if (newPrice !== "") {
            // Update the price in the UI
            itemPriceSpan.textContent = `$${newPrice.value}`;
            itemPriceSpan1.textContent = `${newName.value}`;

            // Update the price in the database
            const itemRef = ref(db, `food/${category}/${key}`);
            console.log(newPrice.value);
            update(ref(db, 'food/' + category + '/' + key), {
                price: newPrice.value,
                name: newName.value
            })
                .then(() => {
                    // Data saved successfully!
                    console.log("Success");

                    // Close the modify modal
                    modifyModal.style.display = "none";
                })
                .catch((error) => {
                    // The write failed...
                    console.log(error);
                });
        }
    }

    // When the user clicks the close button (×), close the modify modal
    var closeBtn = modifyModal.querySelector('.close');
    closeBtn.onclick = function () {
        modifyModal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modify modal, close it
    window.onclick = function (event) {
        if (event.target == modifyModal) {
            modifyModal.style.display = "none";
        }
    }

    // Open the modify modal
    modifyModal.style.display = "block";
}


