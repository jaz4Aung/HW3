// Function to fetch and display trucking companies
function loadTruckingCompanies() {
    const jsonUrl = document.getElementById('jsonUrl').value.trim();
    const errorMessage = document.getElementById('errorMessage');

    // Clear previous error messages
    errorMessage.innerHTML = '';


    if (!jsonUrl) {
        errorMessage.innerHTML = 'Error: Please enter a valid JSON file URL.';
        return;
    }

    // Fetch the JSON file from the server
    fetch(jsonUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the JSON file
        })
        .then(data => {
            // Validate the structure of the JSON
            if (!data.Mainline || !data.Mainline.Table || !data.Mainline.Table.Row) {
                throw new Error('Invalid JSON format: Missing expected data fields.');
            }

            if (data.Mainline &&
                data.Mainline.Table &&
                data.Mainline.Table.Row &&
                data.Mainline.Table.Row.length === 0) {
                throw new Error('No trucking companies found in the JSON file.');
            }

            displayTruckingCompanies(data);
        })
        .catch(error => {
            errorMessage.innerHTML = `Error: ${error.message}`;
        });
}

// Function to display trucking companies in a new pop-up window
function displayTruckingCompanies(data) {
    // Create a new pop-up window for displaying the table
    const tableWindow = window.open('', '', 'width=800,height=600,scrollbars=yes');

    let tableHTML = '<table border="1"><tr>';

    // Create table headers dynamically from the "Header" data
    const headers = data.Mainline.Table.Header.Data;
    headers.forEach(header => {
        tableHTML += `<th>${header}</th>`;
    });
    tableHTML += '</tr>';

    // Loop through each trucking company and add rows to the table
    data.Mainline.Table.Row.forEach(company => {
        tableHTML += '<tr>';
        tableHTML += `<td>${company.Company || ''}</td>`;
        tableHTML += `<td>${company.Services || ''}</td>`;

        // Format Hubs as an unordered list
        let hubsList = '';
        if (company.Hubs?.Hub && Array.isArray(company.Hubs.Hub) && company.Hubs.Hub.length > 0) {
            hubsList = '<ul>';
            company.Hubs.Hub.forEach(hub => {
                hubsList += `<li>${hub}</li>`;
            });
            hubsList += '</ul>';
        }
        tableHTML += `<td>${hubsList}</td>`;

        tableHTML += `<td>${company.Revenue || ''}</td>`;
        tableHTML += `<td>${company.HomePage ? `<a href="${company.HomePage}" target="_blank">${company.HomePage}</a>` : ''}</td>`;  
        tableHTML += `<td style="width:200px; text-align: center;">${company.Logo ? `<img src="${company.Logo}" alt="${company.Company} Logo" width="100">` : ''}</td>`;
        tableHTML += '</tr>';
    });

    tableHTML += '</table>';
    tableWindow.document.write(tableHTML);  // Write the final table content into the new window

}
