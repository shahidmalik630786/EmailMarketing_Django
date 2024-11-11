var hardblacklistid = 0;
var hardblacklistTable;

$(document).ready(function () {
    getprojectid().then(() =>{
        loadList();
    })

    $(document).on('click', '.btn-delete', function () {
        const settingId = $(this).data('id');
        if (confirm("Are you sure you want to delete this record?")) {
            $.ajax({
                url: `/api/hardblacklist/${settingId}/`,
                method: 'DELETE',
                success: function (response) {
                    console.log("Data deleted successfully.");
                    hardblacklistTable.ajax.reload();
                    getprojectid();
                },
                error: function (error) {
                    console.error('Error deleting emails:', error);
                }
            });
        }
    });

    // add default id in insert form
    $('#insertButton').on('click', function(){
        $('#projectId1').val(sessionStorage.getItem('projectId'));
    })

    $('#insertHardBlacklist').on('click', function () {

        $(".error1").text('');
        const projectid = $('#projectId1').val();
        const domain = $('#domain1').val();
        $.ajax({
            url: '/api/hardblacklist/',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                projekt_id: projectid,
                domain: domain,
            }),
            success: function (response) {
                $('#hardblacklistTable').DataTable().ajax.reload(null, false);
                // Clear the form after successful submission
                $('input[type=text], input[type=email], input[type=password], input[type=number], textarea').val('');
                $('#closebutton1').click();
                getprojectid();
            },
            error: function (xhr) {
                const errors = xhr.responseJSON.error; // Assuming the response structure

                if (errors.projekt_id) {
                    $('#projectIdError1').text(errors.projekt_id);
                }
                if (errors.domain) {
                    $('#domainError1').text(errors.domain);
                }
            }
        });
    });
});

// UPDATE

//Prefilling the update form
function getHardBlacklist(id) {
    hardblacklistid = id
    fetch(`/api/hardblacklist/data/${id}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data) {

            const settings = data;
            $('#projectId').val(settings.projekt_id);
            $('#domain').val(settings.domain);

        } else {
            console.log('No data found.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function getprojectid() {
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
            const select = document.getElementById('projectSelect').querySelector('optgroup'); // Access the optgroup
            select.innerHTML = ''; 
            const defaultValue = sessionStorage.getItem("projectId"); 
            data.forEach(setting => {
                const option = document.createElement('option');
                option.value = setting.id; 
                option.textContent = `${setting.name} (${setting.id})`; 
                if (defaultValue && setting.id == defaultValue) {
                    option.selected = true; 
                }
                select.appendChild(option); 
            });
        } else {
            console.log('No data found.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function updateHardBlacklist() {
    $(".error").text('');
    const projekt_id = $('#projectId').val();
    const domain = $('#domain').val();

    const data = {
        projekt_id: projekt_id,
        domain: domain,
    };

    $.ajax({
        url: `/api/hardblacklist/${hardblacklistid}/`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            hardblacklistTable.ajax.reload(null, false);
            $('input[type=text], input[type=email], input[type=password], input[type=number], textarea').val('');
            $('#closebutton').click();
            getprojectid();
        },
        error: function (xhr) {
            const errors = xhr.responseJSON.error;

            if (errors.projekt_id) {
                $('#projectIdError').text(errors.projekt_id);
            }
            if (errors.domain) {
                $('#domainError').text(errors.domain);
            }
        }
    });
};


// Datatable
function loadList() {
    hardblacklistTable = $('#hardblacklistTable').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/api/hardblacklist/",
            "type": "GET",
            "data": function (d) {
                return {
                    "page": (d.start / d.length) + 1,
                    "page_size": d.length,
                    "search[value]": d.search.value,
                    "project_id": $('#projectSelect').val(),
                    "draw": d.draw
                };
            },
            "dataSrc": function (response) {
                return response.data;
            },
            "error": function (xhr, error, thrown) {
                
                console.log(xhr.responseText); 
            }
        },
        "columns": [
            {
                "data": null,
                "render": function (data, type, row) {
                    return `
                    <button type="button" class="btn btn-warning mx-1 btnupdate" data-toggle="modal" data-target="#updateModal" data-id="${row.id}" onclick="getHardBlacklist(${row.id})" ><i class="bi bi-pencil-square"></i></button>
                <button id = "btn-delete" class="btn btn-danger btn-delete mx-1" data-id="${row.id}"><i class="bi bi-trash-fill"></i></button>`;

                },
                "orderable": false,
                "width": "120px"

            },
            { "data": "id", "visible": false },
            { "data": "projekt_id", "visible": false },
            { "data": "domain" },

        ],
        "paging": true,  
        "pageLength": 10,  
        "serverMethod": "GET"
    });
    $('#projectSelect').change(function () {
        const selectedProjectId = $('#projectSelect').val();
        sessionStorage.setItem('projectId', selectedProjectId);
        hardblacklistTable.ajax.reload();
    });

}


//clean the insert form
$('#insertModal').on('hidden.bs.modal', function () {
    $('#insertModal').find('input[type=text], input[type=email], input[type=password], input[type=number], input[type=url], textarea').val('');
    $('.error1').text('');
    $('#insertModal').find('input[type=checkbox]').prop('checked', false);
});