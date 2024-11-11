var skipdomain_id = 0;
var generalwordTable;

$(document).ready(function () {
    getProjectID().then(()=>{
        loadList();
    })
    $(document).on('click', '.btn-delete', function () {
        const skipdomainId = $(this).data('id');
        if (confirm("Are you sure you want to delete this record?")) {
            $.ajax({
                url: `/api/skipdomain/${skipdomainId}/`,
                method: 'DELETE',
                success: function (response) {
                    console.log("Data deleted successfully.");
                    skipdomainTable.ajax.reload();
                    getProjectID();
                },
                error: function (error) {
                    console.error('Error deleting emails:', error);
                }
            });
        }
    });

    // add default id in insert form
    $('#insertButton').on('click', function(){
        $('#projectID1').val(sessionStorage.getItem('projectId'));
    })


    $('#insertSkipdomain').on('click', function () {
        $(".error1").text('');
        const domain = $('#domain1').val();
        const projekt_id = $('#projectID1').val();
        $.ajax({
            url: '/api/skipdomain/',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                domain: domain,
                projekt_id: projekt_id,
            }),
            success: function (response) {
                $('#skipdomainTable').DataTable().ajax.reload(null, false);
                // Clear the form after successful submission
                $('input[type=text], input[type=email], input[type=password], input[type=number], textarea').val('');
                $('#closebutton1').click();
                getProjectID();
            },
            error: function (xhr) {
                const errors = xhr.responseJSON.error; // Assuming the response structure
            
                if (errors.domain) {
                    $('#domainError1').text(errors.domain[0]); // Set error for 'domain'
                }
                if (errors.projekt_id) {
                    $('#projectIDError1').text(errors.projekt_id[0]); // Set error for 'projekt_id'
                }
                
            }
            
        });

    });
});

// UPDATE

//Prefilling the update form
function getSkipdomain(id) {
    skipdomain_id = id
    fetch(`/api/skipdomain/data/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data) {

            const settings = data;
            $('#domain').val(settings.domain);
            $('#projectID').val(settings.projekt_id);
        } else {
            console.log('No data found.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function getProjectID() {
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
                select.appendChild(option); 
                if (defaultValue && setting.id == defaultValue) {
                    option.selected = true; 
                }
            });
        } else {
            console.log('No data found.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function updateSkipdomain() {
    $(".error").text('');
    const domain = $('#domain').val();
    const projekt_id = $('#projectID').val();

    const data = {
        domain: domain,
        projekt_id: projekt_id,
    };

    $.ajax({
        url: `/api/skipdomain/${skipdomain_id}/`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            skipdomainTable.ajax.reload(null, false);
            $('input[type=text], input[type=email], input[type=password], input[type=number], textarea').val('');
            getProjectID();
            $('#closebutton').click();
        },
        error: function (xhr) {
            const errors = xhr.responseJSON.error; // Assuming the response structure
        
            if (errors.domain) {
                $('#domainError').text(errors.domain[0]); // Set error for 'domain'
            }
            if (errors.projekt_id) {
                $('#projectIDError').text(errors.projekt_id[0]); // Set error for 'projekt_id'
            }
            
        }
    });
};


// Datatable
function loadList() {
    skipdomainTable = $('#skipdomainTable').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/api/skipdomain/",
            "type": "GET",
            "data": function (d) {
                return {
                    "page": (d.start / d.length) + 1,
                    "page_size": d.length,
                    "search[value]": d.search.value,
                    "projekt_id": $('#projectSelect').val(),
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
                    <button type="button" class="btn btn-warning mx-1 btnupdate" data-toggle="modal" data-target="#updateModal" data-id="${row.id}" onclick="getSkipdomain('${row.id}')" ><i class="bi bi-pencil-square"></i></button>
                <button id = "btn-delete" class="btn btn-danger btn-delete mx-1" data-id="${row.id}"><i class="bi bi-trash-fill"></i></button>`;

                },
                "orderable": false,
                "width": "120px"

            },
            { "data": "id", "visible": false},
            { "data": "projekt_id", "visible": false},
            { "data": "domain"},

        ],
        "paging": true,  
        "pageLength": 10,  
        "serverMethod": "GET"
    });
    $('#projectSelect').change(function () {
        const selectedProjectId = $('#projectSelect').val();
        sessionStorage.setItem('projectId', selectedProjectId);
        skipdomainTable.ajax.reload(null, false);
    });
}


//clean the insert form
$('#insertModal').on('hidden.bs.modal', function () {
    $('#insertModal').find('input[type=text], input[type=email], input[type=password], input[type=number], input[type=url], textarea').val('');
    $('.error1').text('');
    $('#insertModal').find('input[type=checkbox]').prop('checked', false);
});



