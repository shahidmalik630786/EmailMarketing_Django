var erledigtid = 0;
var generalwordTable;

$(document).ready(function () {
    loadList();
    getGeneralWordId();
    $(document).on('click', '.btn-delete', function () {
        const erledigtId = $(this).data('id');
        if (confirm("Are you sure you want to delete this record?")) {
            $.ajax({
                url: `/api/erledigt/${erledigtId}/`,
                method: 'DELETE',
                success: function (response) {
                    console.log("Data deleted successfully.");
                    erledigtTable.ajax.reload(null, false);
                    getGeneralWordId();
                },
                error: function (error) {
                    console.error('Error deleting emails:', error);
                }
            });
        }
    });


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
                $('#generalwordsTable').DataTable().ajax.reload();
                // Clear the form after successful submission
                $('input[type=text], input[type=email], input[type=password], input[type=number], textarea').val('');
                $('#closebutton1').click();
                getGeneralWordId();
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
function getGeneralWords(id) {
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

            } else {
                console.log('No data found.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function getGeneralWordId() {
    fetch(`/api/erledigt/data/`, {  
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
            select.innerHTML = ''; // Clear existing options

            data.forEach(setting => {
                const option = document.createElement('option');
                option.value = setting.id; // Changed: Set value to id instead of word
                option.textContent = `${setting.domain} (${setting.projekt_id})`; // Set the text to word and id
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
            getGeneralWordId();
            $('#closebutton').click();
        },
        error: function (xhr) {
            const errors = xhr.responseJSON.error; // Assuming the response structure
        
            if (errors.domain) {
                $('#domainError').text(errors.domain[0]); // Set error for 'domain'
            }
            if (errors.ceo_name) {
                $('#ceoNameError').text(errors.ceo_name[0]); // Set error for 'ceo_name'
            }
            if (errors.email_text) {
                $('#emailTextError').text(errors.email_text[0]); // Set error for 'email_text'
            }
            if (errors.projekt_id) {
                $('#projectIDError').text(errors.projekt_id[0]); // Set error for 'projekt_id'
            }
            if (errors.timestamp) {
                $('#timeStampError').text(errors.timestamp[0]); // Set error for 'timestamp'
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
                    "word": $('#projectSelect').val(),
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
                    <button type="button" class="btn btn-warning mx-1 btnupdate" data-toggle="modal" data-target="#updateModal" data-id="${row.id}" onclick="getGeneralWords(${row.id})" ><i class="bi bi-pencil-square"></i></button>
                <button id = "btn-delete" class="btn btn-danger btn-delete mx-1" data-id="${row.id}"><i class="bi bi-trash-fill"></i></button>`;

                },
                "orderable": false,
                "width": "120px"

            },
            { "data": "id", "visible": false },
            { "data": "domain"},
            { "data": "ceo_name"},
            { "data": "email_text"},
            { "data": "projekt_id"},
            { "data": "timestamp"},

        ],
        "paging": true,  
        "pageLength": 10,  
        "serverMethod": "GET"
    });
    $('#projectSelect').change(function () {
        erledigtTable.ajax.reload(null, false);
    });
}



