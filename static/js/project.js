var projectTable;
var projectId = 0;

$(document).ready(function () {
    loadList();
    getProjectid();
});

// Delete

$(document).on('click', '.btn-delete', function () {
    const projectId = $(this).data('id');

    if (confirm("Are you sure you want to delete this project?")) {
        $.ajax({
            url: `/api/project/${projectId}/`,
            method: 'DELETE',
            success: function (response) {
                console.log("Project deleted successfully.");

                // Refresh DataTable
                const table = $('#projectTable').DataTable();
                table.row($(this).parents('tr')).remove().draw();
                getProjectid();
            },
            error: function (error) {
                console.error('Error deleting project:', error);
            }
        });
    }
});



// UPDATE

//Prefilling the update form
function getProject(id){
    projectId = id
    fetch(`/api/project/data/${id}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data) {

            const settings = data;

            $('#projectName1').val(settings.name);            

        } else {
            console.log('No data found.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

}


function getProjectid() {
    fetch(`/api/project/data/`, {  
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data && Array.isArray(data)) {
            const select = document.getElementById('projectSelect').querySelector('optgroup'); 
            select.innerHTML = ''; 

            data.forEach(setting => {
                const option = document.createElement('option');
                option.value = setting.id; // Set value to projekt_id
                option.textContent = `${setting.name} (${setting.id})`;; // Set the text to ceo_name and projekt_id
                select.appendChild(option); // Append the option to the optgroup
            });
        } else {
            console.log('No data found.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function updateProject() {
    const projectName = document.getElementById("projectName1").value;

    const data = {
        name: projectName
    };

    let hasErrors = false;

    const errorElement = document.getElementById('projectnameError1');
    errorElement.textContent = '';

    if (projectName.trim() === '') {
        errorElement.textContent = 'Project name is required.';
        hasErrors = true;
    } else if (projectName.length < 3) {
        errorElement.textContent = 'Project name must be at least 3 characters long.';
        hasErrors = true;
    } else if (projectName.length > 50) {
        errorElement.textContent = 'Project name must not exceed 50 characters.';
        hasErrors = true;
    }

    if (hasErrors) {
        return; 
    }
        
    document.getElementById('closebutton1').click()
    fetch(`/api/project/${projectId}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.msg) {
            $('#projectTable').DataTable().ajax.reload();
        } else {
            console.log('Failed to update the project. Error: ' + (data.error || 'Unknown error'));
        }
        getProjectid();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


// Insert

// Handle the form submission
$('#insertProject').on('click', function () {
    // Get the input value
    const projectName = $('#exampleInputName').val();

    let hasErrors = false;

    document.getElementById(`projectnameError1`).textContent = '';

    if (projectName.trim() === '') {
        document.getElementById(`projectnameError1`).textContent = 'Project name is required.';
        hasErrors = true;
    } else if (projectName.length < 3) {
        document.getElementById(`projectnameError1`).textContent = 'Project name must be at least 3 characters long.';
        hasErrors = true;
    } else if (projectName.length > 50) {
        document.getElementById(`projectnameError1`).textContent = 'Project name must not exceed 50 characters.';
        hasErrors = true;
    }

    if (hasErrors) {
        return;
    }

    if (!projectName) {
        return;
    }
    $('#closebutton').click();

    $.ajax({
        url: '/api/project/',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ name: projectName }),
        success: function (response) {

            $('#projectTable').DataTable().ajax.reload();
            $('#exampleInputName').val('');
            getProjectid();
            
        },
        error: function (xhr) {
            const errors = xhr.responseJSON.error || "An error occurred. Please try again.";
        }
    });
});


// Datatable
function loadList(){
    projectTable = $('#projectTable').DataTable({
        "processing": true,
        "serverSide": true,  
        "ajax": {
            "url": "/api/project/",
            "type": "GET",
            "data": function (d) {
                return {
                    "page": (d.start / d.length) + 1,  
                    "page_size": d.length,  
                    "search[value]": d.search.value,
                    "id": $('#projectSelect').val(),
                    "draw": d.draw
                };
            },
            "dataSrc": function (response) {
                return response.data;  
            }
        },
        "columns": [
            {
                "data": null,
                "render": function (data, type, row) {
                    return `
                    <button type="button" class="btn btn-warning mx-1 btnupdate" data-toggle="modal" data-target="#updateModal" data-id="${row.id}" onclick="getProject(${row.id})" ><i class="bi bi-pencil-square"></i></button>
    
    <button class="btn btn-danger btn-delete mx-1" data-id="${row.id}"><i class="bi bi-trash-fill"></i></button>

            
        `;

                },
                "orderable": false,
                "width": "200px"

            },
            { "data": "id","visible": false },
            { "data": "name" },

        ],
        "paging": true,  // Enable pagination
        "pageLength": 10,  // Default page size
        "serverMethod": "GET"
    });
    $('#projectSelect').change(function () {
        projectTable.ajax.reload(null, false);
        getProjectid();
    });
}


