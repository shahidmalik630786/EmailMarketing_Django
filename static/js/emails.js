var emailId = 0;
var emailTable;

$(document).ready(function () {
    loadList();
    getprojectid();


    $(document).on('click', '.btn-delete', function () {
        const settingId = $(this).data('id');

        if (confirm("Are you sure you want to delete this record?")) {
            $.ajax({
                url: `/api/emails/${settingId}/`,
                method: 'DELETE',
                success: function (response) {
                    console.log("Data deleted successfully.");
                    emailTable.ajax.reload(null,false);
                    getprojectid();
                },
                error: function (error) {
                    console.error('Error deleting emails:', error);
                }
            });
        }
    });

    $('#insertEmails').on('click', function () {
        

        $(".error1").text('');
        const projectid = $('#projectId1').val();
        const ceoname = $('#ceoName1').val();
        const email = $('#email1').val();
        const domain = $('#domain1').val();

        $.ajax({
            url: '/api/emails/',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                email: email,
                projekt_id: projectid,
                ceo_name: ceoname,
                domain: domain,
            }),
            success: function (response) {
    
                $('#emailsTable').DataTable().ajax.reload();

                // Clear the form after successful submission
                $('input[type=text], input[type=email], input[type=password], input[type=number], textarea').val('');

                $('#closebutton1').click();
                getprojectid();
                
            },
            error: function (xhr) {
                const errors = xhr.responseJSON.error; // Assuming the response structure

                if (errors.email) {
                    $('#emailError1').text(errors.email);
                }
                if (errors.projekt_id) {
                    $('#projectIdError1').text(errors.projekt_id);
                }
                if (errors.ceo_name) {
                    $('#ceoNameError1').text(errors.ceo_name);
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
function getSettings(id){
    emailId = id
    fetch(`/api/emails/data/${id}/`, {
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
            $('#ceoName').val(settings.ceo_name);
            $('#email').val(settings.email);
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
    fetch(`/api/emails/data/`, {  
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
                option.value = setting.projekt_id; // Set value to projekt_id
                option.textContent = `${setting.ceo_name} (${setting.projekt_id})`; // Set the text to ceo_name and projekt_id
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


function updateEmails() {
    $(".error").text('');
    const projekt_id = $('#projectId').val();
    const ceoname = $('#ceoName').val();
    const email = $('#email').val();
    const domain = $('#domain').val();    

    const data = {
    email: email,
    projekt_id: projekt_id,
    ceo_name: ceoname,
    domain: domain,
        };

    $.ajax({
        url: `/api/emails/${emailId}/`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            //emailTable.clear().draw();
            emailTable.ajax.reload(null,false);

            $('input[type=text], input[type=email], input[type=password], input[type=number], textarea').val('');

            $('#closebutton').click();
            getprojectid();

            
        },
        error: function (xhr) {
            const errors = xhr.responseJSON.error; 

            if (errors.email) {
                $('#emailError').text(errors.email);
            }
            if (errors.projekt_id) {
                $('#projectIdError').text(errors.projekt_id);
            }
            if (errors.ceo_name) {
                $('#ceoNameError').text(errors.ceo_name);
            }
            if (errors.domain) {
                $('#domainError').text(errors.domain);
            }

            
        }
    });
};

// Datatable
function loadList() {
    emailTable = $('#emailsTable').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/api/emails/",
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
                
                console.log(xhr.responseText); // Log the error response for debugging
            }
        },
        "columns": [
            {
                "data": null,
                "render": function (data, type, row) {
                    return `
                    <button type="button" class="btn btn-warning mx-1 btnupdate" data-toggle="modal" data-target="#updateModal" data-id="${row.id}" onclick="getSettings(${row.id})" ><i class="bi bi-pencil-square"></i></button>
                <button id = "btn-delete" class="btn btn-danger btn-delete mx-1" data-id="${row.id}"><i class="bi bi-trash-fill"></i></button>`;

                },
                "orderable": false,
                "width": "120px"

            },
            { "data": "id", "visible": false },
            { "data": "projekt_id" },
            { "data": "ceo_name" },
            { "data": "email" },
            { "data": "domain" },

        ],
        "paging": true,  // Enable pagination
        "pageLength": 10,  // Default page size
        "serverMethod": "GET"
    });
    $('#projectSelect').change(function () {
        emailTable.ajax.reload();
    });

}