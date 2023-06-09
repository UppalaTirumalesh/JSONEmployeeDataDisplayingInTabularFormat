let defaultAddress;
let employeeTable = document.getElementById("employeeTable");
let content = document.getElementById("tableBody");
let editForm = document.getElementById("editForm");
let editEmployeeId = document.getElementById("editEmployeeId");
let editFullName = document.getElementById("editFullName");
let editFirstName = document.getElementById("editFirstName");
let editLastName = document.getElementById("editLastName");
let editJobTitle = document.getElementById("editJobTitle");
let editPhoneNumber = document.getElementById("editPhoneNumber");
let editEmailAddress = document.getElementById("editEmailAddress");
let editAddressLine1 = document.getElementById("editAddressLine1");
let editAddressLine2 = document.getElementById("editAddressLine2");
let editCity = document.getElementById("editCity");
let editState = document.getElementById("editState");
let editPostalCode = document.getElementById("editPostalCode");
let editCountry = document.getElementById("editCountry");
let recordsPerPageEl = document.getElementById("table_size");
let employeesList = [];

let currentPage = 1;
let totalPages = 1;
let tableSize = parseInt(recordsPerPageEl.value);

(async function() {
  try {
    const response = await fetch("./Emp.json");
    const data = await response.json();
    employeesList = data.Employees;
    totalPages = Math.ceil(employeesList.length / tableSize);
    renderEmployees();
    updatePagination();
  } catch (error) {
    console.log("Error:", error);
  }
})();

function renderEmployees() {
  const startIndex = (currentPage - 1) * tableSize;
  const endIndex = Math.min(startIndex + tableSize, employeesList.length);
  const tableRows = employeesList.slice(startIndex, endIndex);
  
  content.innerHTML = "";

  tableRows.forEach((employee) => {
    defaultAddress = employee.Address.find((address) => address.isDefault);
    const tr = `
      <tr>
        <td>${employee.userId}</td>
        <td>${employee.preferredFullName}</td>
        <td>${employee.emailAddress}</td>
        <td>${`${defaultAddress.Address1}, ${defaultAddress.Address2}, ${defaultAddress.City}, ${defaultAddress.State}, ${defaultAddress.PostalCode}, ${defaultAddress.Country}`}</td>
        <td>
          <button class="btn btn-primary" data-toggle="modal" data-emp='${JSON.stringify(employee)}' data-target="#editModal" onclick="editEmployee(event)">Edit</button>
          <button class="btn btn-danger" data-emp='${JSON.stringify(employee)}' onclick="deleteEmployee(this)">Delete</button>
        </td>
      </tr>
    `;
    content.innerHTML += tr;
  });
}

function editEmployee(event) {
  // ... previous code ...
}

function deleteEmployee(button) {
  // ... previous code ...
}

function searchEmployees() {
  // ... previous code ...
}

function updatePagination() {
  const entriesInfo = document.getElementById("entries_info");
  const prevButton = document.getElementById("prev_button");
  const nextButton = document.getElementById("next_button");
  const indexButtons = document.querySelectorAll(".index_button");

  const startIndex = (currentPage - 1) * tableSize + 1;
  const endIndex = Math.min(currentPage * tableSize, employeesList.length);
  entriesInfo.textContent = `Showing ${startIndex} to ${endIndex} of ${employeesList.length} entries`;

  indexButtons.forEach((button, index) => {
    if (index + 1 === currentPage) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });

  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;
}

recordsPerPageEl.addEventListener("change", (event) => {
  tableSize = parseInt(event.target.value);
  totalPages = Math.ceil(employeesList.length / tableSize);
  currentPage = 1;
  renderEmployees();
  updatePagination();
});

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderEmployees();
    updatePagination();
  }
}

function nextPage() {
  if (currentPage < totalPages) {
    currentPage++;
    renderEmployees();
    updatePagination();
  }
}

document.getElementById("prev_button").addEventListener("click", prevPage);
document.getElementById("next_button").addEventListener("click", nextPage);
