

$(document).ready(function() {
    $('#example').DataTable({
        "processing": true,
        "serverSide": true,  // Enable server-side processing
        "ajax": {
            "url": "/api/project/",
            "type": "GET",
            "data": function(d) {
                return {
                    "page": (d.start / d.length) + 1,  // Calculate the page number
                    "page_size": d.length,  // Page size (number of records per page)
                    "search[value]": d.search.value
                };
            },
            "dataSrc": function(response) {
                return response.data;  // Data to populate in the table
            }
        },
        "columns": [
            {
                "data": null,
                "render": function (data, type, row) {
                    return `
    <button type="button" class="btn btn-warning mx-1 btnupdate" data-toggle="modal" data-target="#exampleModal${row.id}" data-id="${row.id}"><i class="bi bi-pencil-square"></i></button>

    <div class="modal fade" id="exampleModal${row.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Update Project</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label for="exampleInputName${row.id}">Name</label>
                            <input type="text" class="form-control" id="exampleInputName${row.id}" aria-describedby="NameHelp" value="${row.name}" 
                            >
                            <span class="error" id="projectnameError${row.id}" style = "color: red;font-size: 12px;" ></span>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button id="closebutton${row.id}" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="updateProject(${row.id})">Save</button>
                </div>
            </div>
        </div>
    </div>

    <button class="btn btn-danger btn-delete mx-1" data-id="${row.id}"><i class="bi bi-trash-fill"></i></button>

        <script>
            function updateProject(projectId) {
                const projectName = document.getElementById(\`exampleInputName\${projectId}\`).value;

                const data = {
                    name: projectName
                };

                let hasErrors = false;

                const errorElement = document.getElementById(\`projectnameError\${projectId}\`);
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
                    
                document.getElementById(\`closebutton\${projectId}\`).click()
                fetch(\`/api/project/\${projectId}/\`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.msg) {
                        $('#example').DataTable().ajax.reload();
                    } else {
                        console.log('Failed to update the project. Error: ' + (data.error || 'Unknown error'));
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        </script>`;

                },
                "orderable": false,
                "width": "200px"
                
            },
            { "data": "id" },
            { "data": "name" },

        ],
        "paging": true,  // Enable pagination
        "pageLength": 10,  // Default page size
        "serverMethod": "GET"
    });
});

// Delete

$(document).on('click', '.btn-delete', function() {
    const projectId = $(this).data('id');  

    if (confirm("Are you sure you want to delete this project?")) {
        $.ajax({
            url: `/api/project/${projectId}/`,  
            method: 'DELETE',
            success: function(response) {
                console.log("Project deleted successfully.");
                
                // Refresh DataTable
                const table = $('#example').DataTable();
                table.row($(this).parents('tr')).remove().draw();  
            },
            error: function(error) {
                console.error('Error deleting project:', error);
                console.log("Error deleting the project.");
            }
        });
    }
});


// Insert

// Handle the form submission
$('#updatesavebutton').on('click', function() {
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
        success: function(response) {

            $('#example').DataTable().ajax.reload();  



            $('#exampleInputName').val('');  
        },
        error: function(xhr) {
            const errors = xhr.responseJSON.error || "An error occurred. Please try again.";
        }
    });
});