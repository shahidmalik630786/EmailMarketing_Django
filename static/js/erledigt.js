var erledigtid = 0;
var generalwordTable;

$(document).ready(function () {
    erledigtID().then(()=>{
        loadList();
    })
    $(document).on('click', '.btn-delete', function () {
        const erledigtId = $(this).data('id');
        if (confirm("Are you sure you want to delete this record?")) {
            $.ajax({
                url: `/api/erledigt/${erledigtId}/`,
                method: 'DELETE',
                success: function (response) {
                    console.log("Data deleted successfully.");
                    erledigtTable.ajax.reload();
                    erledigtID();
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


    $('#insertErledigt').on('click', function () {

        $(".error1").text('');
        const domain = $('#domain1').val();
        const ceo_name = $('#ceoName1').val();
        const email_text = $('#emailText1').val();
        const projekt_id = $('#projectID1').val();
        const timestamp = $('#timeStamp1').val();
        $.ajax({
            url: '/api/erledigt/',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                domain: domain,
                ceo_name: ceo_name,
                email_text: email_text,
                projekt_id: projekt_id,
                timestamp: timestamp,
            }),
            success: function (response) {
                $('#generalwordsTable').DataTable().ajax.reload(null, false);
                // Clear the form after successful submission
                $('#timeStamp1').val('');
                $('input[type=text], input[type=email], input[type=password], input[type=number], input[type=datetime-local], textarea').val('');
                $('#closebutton1').click();
                erledigtID();
            },
            error: function (xhr) {
                const errors = xhr.responseJSON.error; // Assuming the response structure
            
                if (errors.domain) {
                    $('#domainError1').text(errors.domain[0]); // Set error for 'domain'
                }
                if (errors.ceo_name) {
                    $('#ceoNameError1').text(errors.ceo_name[0]); // Set error for 'ceo_name'
                }
                if (errors.email_text) {
                    $('#emailTextError1').text(errors.email_text[0]); // Set error for 'email_text'
                }
                if (errors.projekt_id) {
                    $('#projectIDError1').text(errors.projekt_id[0]); // Set error for 'projekt_id'
                }
                if (errors.timestamp) {
                    $('#timeStampError1').text(errors.timestamp[0]); // Set error for 'timestamp'
                }
            }
            
        });

    });
});

// UPDATE

//Prefilling the update form
function getErledigit(id) {
    erledigtid = id
    fetch(`/api/erledigt/data/${id}/`, {
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
                $('#ceoName').val(settings.ceo_name);
                $('#emailText').val(settings.email_text);
                $('#projectID').val(settings.projekt_id);
                $('#timeStamp').val(settings.timestamp);

                if (settings.timestamp) {
                const formattedTimestamp = new Date(settings.timestamp).toISOString().slice(0, 16);
                $('#timeStamp').val(formattedTimestamp);
                } else {
                    $('#timeStamp').val(''); 
                }

            } else {
                console.log('No data found.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function erledigtID() {
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




function updateErledigt() {
    $(".error").text('');
    const domain = $('#domain').val();
    const ceo_name = $('#ceoName').val();
    const email_text = $('#emailText').val();
    const projekt_id = $('#projectID').val();
    const timestamp = $('#timeStamp').val();

    const data = {
        domain: domain,
        ceo_name: ceo_name,
        email_text: email_text,
        projekt_id: projekt_id,
        timestamp: timestamp,
    };

    $.ajax({
        url: `/api/erledigt/${erledigtid}/`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            erledigtTable.ajax.reload(null, false);
            $('input[type=text], input[type=email], input[type=password], input[type=number], textarea').val('');
            erledigtID();
            $('#closebutton').click();
        },
        error: function (xhr) {
            const errors = xhr.responseJSON.error; 
        
            if (errors.domain) {
                $('#domainError').text(errors.domain[0]); 
            }
            if (errors.ceo_name) {
                $('#ceoNameError').text(errors.ceo_name[0]); 
            }
            if (errors.email_text) {
                $('#emailTextError').text(errors.email_text[0]); 
            }
            if (errors.projekt_id) {
                $('#projectIDError').text(errors.projekt_id[0]);
            }
            if (errors.timestamp) {
                $('#timeStampError').text(errors.timestamp[0]); 
            }
        }
    });
};


// Datatable
function loadList() {
    erledigtTable = $('#erledigtTable').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/api/erledigt/",
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
                    <button type="button" class="btn btn-warning mx-1 btnupdate" data-toggle="modal" data-target="#updateModal" data-id="${row.id}" onclick="getErledigit(${row.id})" ><i class="bi bi-pencil-square"></i></button>
                <button id = "btn-delete" class="btn btn-danger btn-delete mx-1" data-id="${row.id}"><i class="bi bi-trash-fill"></i></button>`;

                },
                "orderable": false,
                "width": "120px"

            },
            { "data": "id", "visible": false },
            { "data": "projekt_id", "visible": false},
            { "data": "domain"},
            { "data": "ceo_name"},

        ],
        "paging": true,  
        "pageLength": 10,  
        "serverMethod": "GET"
    });
    $('#projectSelect').change(function () {
        const selectedProjectId = $('#projectSelect').val();
        sessionStorage.setItem('projectId', selectedProjectId);
        erledigtTable.ajax.reload(null, false);
    });
}

//clean the insert form
$('#insertModal').on('hidden.bs.modal', function () {
    $('#insertModal').find('input[type=text], input[type=email], input[type=password], input[type=number], input[type=url], textarea').val('');
    $('.error1').text('');
    $('#insertModal').find('input[type=checkbox]').prop('checked', false);
});


