var generalwordid = 0;
var generalwordTable;

$(document).ready(function () {
    getGeneralWords().then(()=>{
        loadList();
    });
    
    $(document).on('click', '.btn-delete', function () {
        const settingId = $(this).data('id');
        if (confirm("Are you sure you want to delete this record?")) {
            $.ajax({
                url: `/api/generalwords/${settingId}/`,
                method: 'DELETE',
                success: function (response) {
                    console.log("Data deleted successfully.");
                    generalwordTable.ajax.reload();
                    getGeneralWords();
                },
                error: function (error) {
                    console.error('Error deleting emails:', error);
                }
            });
        }
    });
    


    $('#insertGeneralword').on('click', function () {

        $(".error1").text('');
        const word = $('#word1').val();
        $.ajax({
            url: '/api/generalwords/',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                word: word,
            }),
            success: function (response) {
                $('#generalwordsTable').DataTable().ajax.reload(null, false);
                // Clear the form after successful submission
                $('input[type=text], input[type=email], input[type=password], input[type=number], textarea').val('');
                $('#closebutton1').click();
                getGeneralWords();
            },
            error: function (xhr) {
                const errors = xhr.responseJSON.error; // Assuming the response structure

                if (errors.word) {
                    $('#wordError1').text(errors.word);
                }
            }
        });

    });
});

// UPDATE

//Prefilling the update form
function getGeneralWordsID(id) {
    generalwordid = id
    fetch(`/api/generalwords/data/${id}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data) {

                const settings = data;
                $('#word').val(settings.word);

            } else {
                console.log('No data found.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function getGeneralWords() {
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
            select.innerHTML = ''; // Clear existing options
            const defaultValue = sessionStorage.getItem("projectId");
            data.forEach(setting => {
                const option = document.createElement('option');
                option.value = setting.id; // Changed: Set value to id instead of word
                option.textContent = `${setting.name} (${setting.id})`; // Set the text to word and id
                if (defaultValue && setting.id == defaultValue) {
                    option.selected = true; 
                }
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


function updateGeneralword() {
    $(".error").text('');
    const word = $('#word').val();

    const data = {
        word: word,
    };

    $.ajax({
        url: `/api/generalwords/${generalwordid}/`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            generalwordTable.ajax.reload(null, false);
            $('input[type=text], input[type=email], input[type=password], input[type=number], textarea').val('');
            $('#closebutton').click();
            geteErledigt();
        },
        error: function (xhr) {
            const errors = xhr.responseJSON.error;
            if (errors.word) {
                $('#wordError').text(errors.word);
            }
        }
    });
};



function loadList() {
    generalwordTable = $('#generalwordsTable').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/api/generalwords/",
            "type": "GET",
            "data": function (d) {
                return {
                    "page": (d.start / d.length) + 1,
                    "page_size": d.length,
                    "search[value]": d.search.value,
                    "generalwordid": $('#projectSelect').val(),
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
                    <button type="button" class="btn btn-warning mx-1 btnupdate" data-toggle="modal" data-target="#updateModal" data-id="${row.id}" onclick="getGeneralWordsID(${row.id})" ><i class="bi bi-pencil-square"></i></button>
                <button id = "btn-delete" class="btn btn-danger btn-delete mx-1" data-id="${row.id}"><i class="bi bi-trash-fill"></i></button>`;

                },
                "orderable": false,
                "width": "120px"

            },
            { "data": "id", "visible": false },
            {
                "data": "word",
                "render": function (data) {
                    return data.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                }
            }

        ],
        "paging": true,  
        "pageLength": 10,  
        "serverMethod": "GET"
    });
    $('#projectSelect').change(function () {
        const selectedProjectId = $('#projectSelect').val();
        sessionStorage.setItem('projectId', selectedProjectId);
        generalwordTable.ajax.reload();
    });
}

//clean the insert form
$('#insertModal').on('hidden.bs.modal', function () {
    $('#insertModal').find('input[type=text], input[type=email], input[type=password], input[type=number], input[type=url], textarea').val('');
    $('.error1').text('');
    $('#insertModal').find('input[type=checkbox]').prop('checked', false);
});