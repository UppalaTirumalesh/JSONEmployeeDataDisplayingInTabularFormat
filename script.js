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
let entriesInfo = document.getElementById("entries_info");
let prevButton = document.getElementById("prev_button");
let nextButton = document.getElementById("next_button");
let indexButtons = document.querySelectorAll(".index_button");
let paginationContainer = document.getElementById("paginationContainer");
let recordsPerPageEl = document.getElementById("table_size");
let tableHeading = document.getElementById("tableHeading");
let footer = document.getElementById("footerContainer");
let employeesList = [];
let tableSize = 5;
let currentPage = 1;
let totalEntries = 30;
let totalPages;


(async function() {
try {
    const response = await fetch("./Emp.json")
    const data = await response.json()
    employeesList = data.Employees;
    // console.log(employeesList);
    totalPages = Math.ceil(employeesList.length / tableSize);
    // console.log(totalPages);
    let recordsPerPage = recordsPerPageEl.value;  //5
    entriesInfo.textContent = `Showing ${(currentPage - 1) * tableSize + 1} to ${Math.min(currentPage * tableSize, employeesList.length)} of ${employeesList.length} entries`;
    employes = employeesList.slice(0, recordsPerPage)   
  } catch (error) {
    console.log("Error:", error);
  }
  renderEmployee(employes);
})();
  
  function renderEmployee(employees){
    content.innerHTML = "";
    employees.forEach((employee) => {
    defaultAddress = employee.Address.find((address) => address.isDefault);
    let out = `<tr>
    <td>${employee.userId}</td>
                   <td>${employee.preferredFullName}</td>
                   <td>${employee.emailAddress}</td>
                   <td>${`${defaultAddress.Address1}, ${defaultAddress.Address2}, ${defaultAddress.City}, ${defaultAddress.State}, ${defaultAddress.PostalCode}, ${defaultAddress.Country}`}</td>
                   <td>
                      <button class="btn btn-primary" data-toggle="modal" data-emp='${JSON.stringify(
                        employee
                      )}' data-target="#editModal" onclick="editEmployee(event)">Edit</button>
                      <button class="btn btn-danger" data-emp='${JSON.stringify(
                        employee
                      )}' onclick="deleteEmployee(this)">Delete</button>
                  </td>
                  </tr>`;
                  content.innerHTML += out;
  });
}


function editEmployee(event) {

  // Find the parent <tr> element of the clicked button
  const parentRow = event.target.closest("tr");

  // Find the relevant table cells within the row using their indices
  const jobTitleCell = parentRow.cells[0];
  const fullNameCell = parentRow.cells[1];
  const emailAddressCell = parentRow.cells[2];
  const addressCell = parentRow.cells[3];

  const employeeData = event.target.getAttribute("data-emp");
  // Parse the employee JSON string back into an object
  const employee = JSON.parse(employeeData);

  editEmployeeId.value = employee.userId;
  editFullName.value = employee.preferredFullName;
  editJobTitle.value = employee.jobTitleName;
  editPhoneNumber.value = employee.phoneNumber;
  editEmailAddress.value = employee.emailAddress;
  editFirstName.value = employee.firstName;
  editLastName.value = employee.lastName;
  editAddressLine1.value = defaultAddress ? defaultAddress.Address1 : "";
  editAddressLine2.value = defaultAddress ? defaultAddress.Address2 : "";
  editCity.value = defaultAddress ? defaultAddress.City : "";
  editState.value = defaultAddress ? defaultAddress.State : "";
  editPostalCode.value = defaultAddress ? defaultAddress.PostalCode : "";
  editCountry.value = defaultAddress ? defaultAddress.Country : "";

  editForm.addEventListener("submit", (event) => {
    event.preventDefault();

    employee.userId = editEmployeeId.value;
    employee.preferredFullName = editFullName.value;
    employee.emailAddress = editEmailAddress.value;

    if (defaultAddress) {
      defaultAddress.Address1 = editAddressLine1.value;
      defaultAddress.Address2 = editAddressLine2.value;
      defaultAddress.City = editCity.value;
      defaultAddress.State = editState.value;
      defaultAddress.PostalCode = editPostalCode.value;
      defaultAddress.Country = editCountry.value;
    }

    jobTitleCell.innerHTML = employee.userId;
    fullNameCell.innerHTML = employee.preferredFullName;
    emailAddressCell.innerHTML = employee.emailAddress;
    addressCell.innerHTML = defaultAddress
      ? `${editAddressLine1.value}, ${editAddressLine2.value}, ${editCity.value}, ${editState.value}, ${editPostalCode.value}, ${editCountry.value}`
      : "";

      $('.modal-header .close').click();
  });
}

function deleteEmployee(button) {
  // console.log(button);
  const employeeData = button.getAttribute('data-emp');
  const employee = JSON.parse(employeeData);
  const confirmation = confirm("Are you sure you want to delete this employee?\n\nID: " + employee.userId);
  // console.log(confirmation);
  if (confirmation) {
    const parentRow = button.closest("tr");
    // console.log(parentRow);
    parentRow.remove();
  }
}

function searchEmployees() {
  const searchInput = document.getElementById("searchInput").value.toLowerCase();
  
  const filteredEmployeesData = employeesList.filter((employee) => {
    const defaultAddress = employee.Address.find((address) => address.isDefault);
    const employeeData = `${employee.userId}, ${employee.preferredFullName}, ${employee.emailAddress}, ${defaultAddress.Address1} ${defaultAddress.Address2} ${defaultAddress.City} ${defaultAddress.State} ${defaultAddress.PostalCode} ${defaultAddress.Country}`;
    return employeeData.toLowerCase().includes(searchInput);
  });
  renderEmployee(filteredEmployeesData);

  // Check if any rows are visible after the search
  let visibleRows = Array.from(content.getElementsByTagName("tr")).filter(
    (row) => row.style.display !== "none"
  );

  if (visibleRows.length === 0) {
    let noDataCell = document.createElement('h1');
    noDataCell.innerHTML = "No Data Found!!!";
    footer.style.display = "none";
    tableHeading.style.display = "none";
    content.appendChild(noDataCell);
  } 
}


function displayTableRows() {
  let startIndex = (currentPage - 1) * tableSize;
  let endIndex = Math.min(startIndex + tableSize, employeesList.length);
  let tableRows = employeesList.slice(startIndex, endIndex);
  let tbody = employeeTable.querySelector("tbody");
  tbody.innerHTML = "";

  tableRows.forEach((employee) => {
    const tr = `
      <tr>
        <td>${employee.userId}</td>
        <td>${employee.preferredFullName}</td>
        <td>${employee.emailAddress}</td>
        <td>${`${defaultAddress.Address1}, ${defaultAddress.Address2}, ${defaultAddress.City}, ${defaultAddress.State}, ${defaultAddress.PostalCode}, ${defaultAddress.Country}`}</td>
        <td>
                      <button class="btn btn-primary" data-toggle="modal" data-emp='${JSON.stringify(
                        employee
                      )}' data-target="#editModal" onclick="editEmployee(event)">Edit</button>
                      <button class="btn btn-danger" data-emp='${JSON.stringify(
                        employee
                      )}' onclick="deleteEmployee(this)">Delete</button>
                  </td>
      </tr>
    `;

    tbody.insertAdjacentHTML('beforeend', tr);
  });
}

function updatePagination() {
  entriesInfo.textContent = `Showing ${(currentPage - 1) * tableSize + 1} to ${Math.min(currentPage * tableSize, employeesList.length)} of ${employeesList.length} entries`;

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

function goToPage(pageNumber) {
  currentPage = pageNumber;
  displayTableRows();
  updatePagination();
}

prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    goToPage(currentPage - 1);
  }
});

nextButton.addEventListener("click", () => {
  if (currentPage < totalPages) {
    goToPage(currentPage + 1);
  }
});

indexButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    goToPage(index + 1);
  });
});

recordsPerPageEl.addEventListener("change", (event) => {
  tableSize = parseInt(event.target.value);
  console.log(tableSize);
  totalPages = Math.ceil(employeesList.length / tableSize);
  console.log(totalPages);
  currentPage = 1;
  displayTableRows();
  updatePagination();
});

displayTableRows();
updatePagination();
