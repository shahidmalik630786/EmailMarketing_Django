var keyword_id = 0;
var generalwordTable;

$(document).ready(function () {
    getProjectID().then(()=>{
        loadList();
    })
    $(document).on('click', '.btn-delete', function () {
        const keywordId = $(this).data('id');
        if (confirm("Are you sure you want to delete this record?")) {
            $.ajax({
                url: `/api/keywords/${keywordId}/`,
                method: 'DELETE',
                success: function (response) {
                    console.log("Data deleted successfully.");
                    keywordTable.ajax.reload();
                    getProjectID();
                },
                error: function (error) {
                    console.error('Error deleting emails:', error);
                }
            });
        }
    });


    $('#insertKeyword').on('click', function () {
        $(".error1").text('');
        const keyword = $('#keyword1').val();
        $.ajax({
            url: '/api/keywords/',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                keyword: keyword,
            }),
            success: function (response) {
                $('#keywordTable').DataTable().ajax.reload(null, false);
                // Clear the form after successful submission
                $('input[type=text], input[type=email], input[type=password], input[type=number], textarea').val('');
                $('#closebutton1').click();
                getProjectID();
            },
            error: function (xhr) {
                const errors = xhr.responseJSON.error; 
            
                if (errors.keyword) {
                    $('#keywordError1').text(errors.keyword[0]); 
                }
                
            }
            
        });

    });
});

// UPDATE

//Prefilling the update form
function getKeyword(id) {
    keyword_id = id
    fetch(`/api/keywords/data/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data) {

            const settings = data;
            $('#keyword').val(settings.keyword);
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
            const select = document.getElementById('projectSelect').querySelector('optgroup'); 
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


function updateKeyword() {
    $(".error").text('');
    const keyword = $('#keyword').val();

    const data = {
        keyword: keyword,
    };

    $.ajax({
        url: `/api/keywords/${keyword_id}/`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            keywordTable.ajax.reload(null, false);
            $('input[type=text], input[type=email], input[type=password], input[type=number], textarea').val('');
            getProjectID();
            $('#closebutton').click();
        },
        error: function (xhr) {
            const errors = xhr.responseJSON.error; 
        
            if (errors.keyword) {
                $('#keywordError').text(errors.keyword[0]); 
            }
            
        }
    });
};


// Datatable
function loadList() {
    keywordTable = $('#keywordTable').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/api/keywords/",
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
                    <button type="button" class="btn btn-warning mx-1 btnupdate" data-toggle="modal" data-target="#updateModal" data-id="${row.id}" onclick="getKeyword('${row.id}')" ><i class="bi bi-pencil-square"></i></button>
                <button id = "btn-delete" class="btn btn-danger btn-delete mx-1" data-id="${row.id}"><i class="bi bi-trash-fill"></i></button>`;

                },
                "orderable": false,
                "width": "120px"

            },
            { "data": "id", "visible": false},
            { "data": "keyword"},

        ],
        "paging": true,  
        "pageLength": 10,  
        "serverMethod": "GET"
    });
    $('#projectSelect').change(function () {
        const selectedProjectId = $('#projectSelect').val();
        sessionStorage.setItem('projectId', selectedProjectId);
        keywordTable.ajax.reload(null, false);
    });
}

//clean the insert form
$('#insertModal').on('hidden.bs.modal', function () {
    $('#insertModal').find('input[type=text], input[type=email], input[type=password], input[type=number], input[type=url], textarea').val('');
    $('.error1').text('');
    $('#insertModal').find('input[type=checkbox]').prop('checked', false);
});

