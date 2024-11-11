var projectTable;
var projectId = 0;

$(document).ready(function () {
    getProjectid().then(() =>{
        loadList();
    })
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
                // projectTable.ajax.reload(null, false);
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
    $(".error").text('');
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
            $('#projectId').val(settings.id);
            $('#name1').val(settings.name);            
        } else {
            console.log('No data found.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function getProjectid() {
    return fetch(`/api/project/data/`, {  
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
            const defaultValue = sessionStorage.getItem("projectId"); 
            data.forEach(setting => {
                const option = document.createElement('option');
                option.value = setting.id; // Set value to projekt_id
                option.textContent = `${setting.name} (${setting.id})`; 

                if (defaultValue && setting.id == defaultValue) {
                    option.selected = true; 
                }

                select.appendChild(option);
            });
            const selectedProjectId = $('#projectSelect').val();
            sessionStorage.setItem('projectId', selectedProjectId);

        } else {
            console.log('No data found.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}





function updateProject() {
    document.getElementById('nameError1').innerHTML = '';
    $(".error").text('');
    const name = $('#name1').val();

    const data = {
        name: name,
    };

    $.ajax({
        url: `/api/project/${projectId}/`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            projectTable.ajax.reload(null, false);
            $('input[type=text], input[type=email], input[type=password], input[type=number], textarea').val('');
            $('#closebutton1').click();
            getProjectid();
        },
        error: function (xhr) {
            const errors = xhr.responseJSON.error;
            if (errors.name) {
                $('#nameError1').text(errors.name);
            }
        }
    });
};


// Insert

// Handle the form submission
$('#insertProject').on('click', function () {
    $(".error1").text('');
    const name = $('#name').val();
    $.ajax({
        url: '/api/project/',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            name: name,
        }),
        success: function (response) {
            $('#projectTable').DataTable().ajax.reload(null, false);
            // Clear the form after successful submission
            $('input[type=text], input[type=email], input[type=password], input[type=number], textarea').val('');
            document.getElementById('closebutton2').click();
            getProjectid();
        },
        error: function (xhr) {
            const errors = xhr.responseJSON.error; 
        
            if (errors.name) {
                $('#nameError').text(errors.name[0]); 
            }
            
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
        const selectedProjectId = $('#projectSelect').val();
        sessionStorage.setItem('projectId', selectedProjectId);
        projectTable.ajax.reload(null, false);
    });
}


//clean the insert form
$('#exampleModal').on('hidden.bs.modal', function () {
    $('#name').val('');
    $('.error1').text('');
});