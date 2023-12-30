
document.addEventListener('DOMContentLoaded', function() {
    const availableFields = ['Product Id', 'Subcategory', 'Title', 'Price', 'Popularity'];
    populateFieldSelectors(availableFields);
});

function populateFieldSelectors(fields) {
    const availableFieldsSelect = document.getElementById('availableFields');
    fields.forEach(field => {
        let option = document.createElement('option');
        option.value = field.toLowerCase();
        option.text = field;
        availableFieldsSelect.appendChild(option);
    });
}

function moveOptions(fromSelect, toSelect) {
    Array.from(fromSelect.selectedOptions).forEach(option => {
        toSelect.appendChild(option.cloneNode(true));
        option.remove();
    });
}

function moveToDisplayed() {
    moveOptions(document.getElementById('availableFields'), document.getElementById('displayedFields'));
}

function moveToAvailable() {
    moveOptions(document.getElementById('displayedFields'), document.getElementById('availableFields'));
}

function next() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        alert('Please select a file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const jsonData = JSON.parse(e.target.result);

            if (!jsonData.products || typeof jsonData.products !== 'object') {
                throw new Error("The JSON structure is not as expected.");
            }

            const productsArray = Object.entries(jsonData.products).map(([id, product]) => ({
                'product id': id,
                ...product
            }));

            displayData(productsArray);
        } catch (error) {
            console.error("Error parsing JSON: ", error);
            alert('Error reading or parsing file: ' + error.message);
        }
    };
    reader.onerror = function() {
        alert('Error reading file');
    };

    reader.readAsText(fileInput.files[0]);
}

function displayData(products) {
    const displayedFieldsSelect = document.getElementById('displayedFields');
    const fieldsToDisplay = Array.from(displayedFieldsSelect.options).map(option => option.value);

    products.sort((a, b) => parseInt(b.popularity) - parseInt(a.popularity));

    const table = document.getElementById('productListTable');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    thead.innerHTML = '';
    tbody.innerHTML = '';

    let headerRow = thead.insertRow();
    fieldsToDisplay.forEach(field => {
        let th = document.createElement('th');
        th.textContent = field.charAt(0).toUpperCase() + field.slice(1);
        headerRow.appendChild(th);
    });

    products.forEach(product => {
        let row = tbody.insertRow();
        fieldsToDisplay.forEach(field => {
            let cell = row.insertCell();
            cell.textContent = product[field] || 'N/A';
        });
    });

    document.querySelector('.grid-container').style.display = 'none';
    document.getElementById('productListPage').style.display = 'block';
}

function cancel() {
    document.getElementById('fileInput').value = '';
    document.getElementById('availableFields').innerHTML = '';
    document.getElementById('displayedFields').innerHTML = '';
    document.querySelector('.grid-container').style.display = 'grid';
    document.getElementById('productListPage').style.display = 'none';
    populateFieldSelectors(['Product Id', 'Subcategory', 'Title', 'Price', 'Popularity']);
}