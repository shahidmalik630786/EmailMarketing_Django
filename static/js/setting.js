var projectId = 0;

$(document).ready(function () {
    getprojectid().then(() => {
        loadList();
    })
    
    $(document).on('click', '.btn-delete', function () {
        const settingId = $(this).data('id');

        if (confirm("Are you sure you want to delete this record?")) {
            $.ajax({
                url: `/api/settings/${settingId}/`,
                method: 'DELETE',
                success: function (response) {
                    console.log("Data deleted successfully.");
                    // const table = $('#settingTable').DataTable();
                    // table.row($(this).parents('tr')).remove().draw();
                    $('#settingTable').DataTable().ajax.reload();
                    getprojectid();
                },
                error: function (error) {
                    console.log("Error deleting the settings.");
                }
            });
        }
    });
    // add default id in insert form
    $('#insertButton').on('click', function(){
        $('#projektId1').val(sessionStorage.getItem('projectId'));
    })


    $('#insertSettings').on('click', function () {
        $(".form-control1").val("");

        $(".error1").text('');
        const absenderName = $('#absenderName1').val();
        const absenderFirma = $('#absenderFirma1').val();
        const absenderStrasse = $('#absenderStrasse1').val();
        const absenderPlz = $('#absenderPlz1').val();
        const absenderTelefon = $('#absenderTelefon1').val();
        const absenderEmail = $('#absenderEmail1').val();
        const smtpEmail = $('#smtpEmail1').val();
        const smtpName = $('#smtpName1').val();
        const smtpPassword = $('#smtpPassword1').val();
        const smtpServer = $('#smtpServer1').val();
        const smtpPort = $('#smtpPort1').val();
        const arbeitsaufgabe = $('#arbeitsaufgabe1').val();
        const betreffAufgabe = $('#betreffAufgabe1').val();
        const tokenLimit = $('#tokenLimit1').val();
        const apiKey = $('#apiKey1').val();
        const absenderHomepage = $('#absenderHomepage1').val();
        const bccEmail1 = $('#bccEmail11').val();
        const bccEmail2 = $('#bccEmail21').val();
        const waitTime = $('#waitTime1').val();
        const sendStartHour = $('#sendStartHour1').val();
        const sendEndHour = $('#sendEndHour1').val();
        const maxWorkers = $('#maxWorkers1').val();
        const debug = $('#debug1').val();
        const projektId = $('#projektId1').val();
        const sslTls = $('#sslTls1').is(':checked');
    
        // let hasErrors = false;
        $('.error1').text('');
        $.ajax({
            url: '/api/settings/',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                absender_name: absenderName,
                absender_firma: absenderFirma,
                absender_strasse: absenderStrasse,
                absender_plz: absenderPlz,
                absender_telefon: absenderTelefon,
                absender_email: absenderEmail,
                smtp_email: smtpEmail,
                smtp_name: smtpName,
                smtp_password: smtpPassword,
                smtp_server: smtpServer,
                smtp_port: smtpPort,
                arbeitsaufgabe: arbeitsaufgabe,
                betreff_aufgabe: betreffAufgabe,
                token_limit: tokenLimit,
                api_key: apiKey,
                absender_homepage: absenderHomepage,
                bcc_email_1: bccEmail1,
                bcc_email_2: bccEmail2,
                wait_time: waitTime,
                send_start_hour: sendStartHour,
                send_end_hour: sendEndHour,
                max_workers: maxWorkers,
                debug: debug,
                projekt_id: projektId,
                ssl_tls: sslTls
            }),
            success: function (response) {
                $('#settingTable').DataTable().ajax.reload(null, false);
                // Clear the form after successful submission
                $('input[type=text], input[type=email], input[type=password], input[type=number], textarea').val('');
                $('#sslTls').prop('checked', false);
                $('#closebutton1').click();
                getprojectid();
            },
            error: function (xhr) {
                const errors = xhr.responseJSON.error;

                if (errors.absender_name) {
                    $('#absenderNameError1').text(errors.absender_name);
                }
                if (errors.absender_email) {
                    $('#absenderEmailError1').text(errors.absender_email);
                }
                if (errors.absender_firma) {
                    $('#absenderFirmaError1').text(errors.absender_firma);
                }
                if (errors.absender_homepage) {
                    $('#absenderHomepageError1').text(errors.absender_homepage);
                }
                if (errors.absender_strasse) {
                    $('#absenderStrasseError1').text(errors.absender_strasse);
                }
                if (errors.absender_plz) {
                    $('#absenderPlzError1').text(errors.absender_plz);
                }
                if (errors.absender_telefon) {
                    $('#absenderTelefonError1').text(errors.absender_telefon);
                }
                if (errors.arbeitsaufgabe) {
                    $('#arbeitsaufgabeError1').text(errors.arbeitsaufgabe);
                }
                if (errors.betreff_aufgabe) {
                    $('#betreffAufgabeError1').text(errors.betreff_aufgabe);
                }
                if (errors.debug) {
                    $('#debugError1').text(errors.debug);
                }
                if (errors.max_workers) {
                    $('#maxWorkersError1').text(errors.max_workers);
                }
                if (errors.projekt_id) {
                    $('#projektIdError1').text(errors.projekt_id);
                }
                if (errors.send_start_hour) {
                    $('#sendStartHourError1').text(errors.send_start_hour);
                }
                if (errors.send_end_hour) {
                    $('#sendEndHourError1').text(errors.send_end_hour);
                }
                if (errors.smtp_email) {
                    $('#smtpEmailError1').text(errors.smtp_email);
                }
                if (errors.smtp_name) {
                    $('#smtpNameError1').text(errors.smtp_name);
                }
                if (errors.smtp_port) {
                    $('#smtpPortError1').text(errors.smtp_port);
                }
                if (errors.smtp_server) {
                    $('#smtpServerError1').text(errors.smtp_server);
                }
                if (errors.smtp_password) {
                    $('#smtpPasswordError1').text(errors.smtp_password);
                }
                if (errors.token_limit) {
                    $('#tokenLimitError1').text(errors.token_limit);
                }
                if (errors.wait_time) {
                    $('#waitTimeError1').text(errors.wait_time);
                }
                if (errors.ssl_tls) {
                    $('#sslTlsError1').text(errors.ssl_tls);
                }
                if (errors.api_key) {
                    $('#apiKeyError1').text(errors.api_key);
                }
                if (errors.bcc_email_1) {
                    $('#bccEmail1Error1').text(errors.bcc_email_1);
                }
                if (errors.bcc_email_2) {
                    $('#bccEmail2Error1').text(errors.bcc_email_2);
                }
                console.log(errors);
            }
        });
    });
});


function getSettings(id){
    projectId = id
    fetch(`/api/settings/data/${id}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data) {
            const settings = data;
            document.getElementById('absenderName').value = settings.absender_name;
            document.getElementById('absenderFirma').value = settings.absender_firma;
            document.getElementById('absenderStrasse').value = settings.absender_strasse;
            document.getElementById('absenderPlz').value = settings.absender_plz;
            document.getElementById('absenderTelefon').value = parseInt(settings.absender_telefon);
            document.getElementById('absenderEmail').value = settings.absender_email;
            document.getElementById('smtpEmail').value = settings.smtp_email;
            document.getElementById('smtpName').value = settings.smtp_name;
            document.getElementById('smtpPassword').value = settings.smtp_password;
            document.getElementById('smtpServer').value = settings.smtp_server;
            document.getElementById('smtpPort').value = settings.smtp_port;
            document.getElementById('arbeitsaufgabe').value = settings.arbeitsaufgabe;
            document.getElementById('betreffAufgabe').value = settings.betreff_aufgabe;
            document.getElementById('tokenLimit').value = settings.token_limit;
            document.getElementById('apiKey').value = settings.api_key;
            document.getElementById('absenderHomepage').value = settings.absender_homepage;
            document.getElementById('bccEmail1').value = settings.bcc_email_1;
            document.getElementById('bccEmail2').value = settings.bcc_email_2;
            document.getElementById('waitTime').value = settings.wait_time;
            document.getElementById('sendStartHour').value = settings.send_start_hour;
            document.getElementById('sendEndHour').value = settings.send_end_hour;
            document.getElementById('maxWorkers').value = settings.max_workers;
            document.getElementById('debug').value = settings.debug;
            document.getElementById('projektId').value = settings.projekt_id;
            document.getElementById('sslTls').checked = settings.ssl_tls;

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
        } else {
            console.log('No data found.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function updateSettings() {
    $(".error").text('');
    const absenderName = $('#absenderName').val();
    const absenderFirma = $('#absenderFirma').val();
    const absenderStrasse = $('#absenderStrasse').val();
    const absenderPlz = $('#absenderPlz').val();
    const absenderTelefon = $('#absenderTelefon').val();
    const absenderEmail = $('#absenderEmail').val();
    const smtpEmail = $('#smtpEmail').val();
    const smtpName = $('#smtpName').val();  
    const smtpServer = $('#smtpServer').val();
    const smtpPort = $('#smtpPort').val();
    const smtpPassword = $('#smtpPassword').val();
    const arbeitsaufgabe = $('#arbeitsaufgabe').val();
    const betreffAufgabe = $('#betreffAufgabe').val();
    const tokenLimit = $('#tokenLimit').val();
    const apiKey = $('#apiKey').val();
    const absenderHomepage = $('#absenderHomepage').val();
    const bccEmail1 = $('#bccEmail1').val();
    const bccEmail2 = $('#bccEmail2').val();
    const waitTime = $('#waitTime').val();
    const sendStartHour = $('#sendStartHour').val();
    const sendEndHour = $('#sendEndHour').val();
    const maxWorkers = $('#maxWorkers').val();
    const debug = $('#debug').val();
    const projektId = $('#projektId').val();
    const sslTls = $('#sslTls').is(':checked');

    const data = {
        absender_name: absenderName,
        absender_firma: absenderFirma,
        absender_strasse: absenderStrasse,
        absender_plz: absenderPlz,
        absender_telefon: absenderTelefon,
        absender_email: absenderEmail,
        smtp_email: smtpEmail,
        smtp_name: smtpName,
        smtp_password: smtpPassword,
        smtp_server: smtpServer,
        smtp_port: smtpPort,
        arbeitsaufgabe: arbeitsaufgabe,
        betreff_aufgabe: betreffAufgabe,
        token_limit: tokenLimit,
        api_key: apiKey,
        absender_homepage: absenderHomepage,
        bcc_email_1: bccEmail1,
        bcc_email_2: bccEmail2,
        wait_time: waitTime,
        send_start_hour: sendStartHour,
        send_end_hour: sendEndHour,
        max_workers: maxWorkers,
        debug: debug,
        projekt_id: projektId,
        ssl_tls: sslTls
    };

    $.ajax({
        url: `/api/settings/${projectId}/`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            $('#settingTable').DataTable().ajax.reload(null, false);
            $('input[type=text], input[type=email], input[type=password], input[type=number], textarea').val('');
            $('#closebutton').click();
            getprojectid();
        },
        error: function (xhr) {
            const errors = xhr.responseJSON.error;

            if (errors.absender_name) {
                $('#absenderNameError').text(errors.absender_name);
            }
            if (errors.absender_email) {
                $('#absenderEmailError').text(errors.absender_email);
            }
            if (errors.absender_firma) {
                $('#absenderFirmaError').text(errors.absender_firma);
            }
            if (errors.absender_homepage) {
                $('#absenderHomepageError').text(errors.absender_homepage);
            }
            if (errors.absender_strasse) {
                $('#absenderStrasseError').text(errors.absender_strasse);
            }
            if (errors.absender_plz) {
                $('#absenderPlzError').text(errors.absender_plz);
            }
            if (errors.absender_telefon) {
                $('#absenderTelefonError').text(errors.absender_telefon);
            }
            if (errors.arbeitsaufgabe) {
                $('#arbeitsaufgabeError').text(errors.arbeitsaufgabe);
            }
            if (errors.betreff_aufgabe) {
                $('#betreffAufgabeError').text(errors.betreff_aufgabe);
            }
            if (errors.debug) {
                $('#debugError').text(errors.debug);
            }
            if (errors.max_workers) {
                $('#maxWorkersError').text(errors.max_workers);
            }
            if (errors.projekt_id) {
                $('#projektIdError').text(errors.projekt_id);
            }
            if (errors.send_start_hour) {
                $('#sendStartHourError').text(errors.send_start_hour);
            }
            if (errors.send_end_hour) {
                $('#sendEndHourError').text(errors.send_end_hour);
            }
            if (errors.smtp_email) {
                $('#smtpEmailError').text(errors.smtp_email);
            }
            if (errors.smtp_name) {
                $('#smtpNameError').text(errors.smtp_name);
            }
            if (errors.smtp_port) {
                $('#smtpPortError').text(errors.smtp_port);
            }
            if (errors.smtp_server) {
                $('#smtpServerError').text(errors.smtp_server);
            }
            if (errors.smtp_password) {
                $('#smtpPasswordError').text(errors.smtp_password);
            }
            if (errors.token_limit) {
                $('#tokenLimitError').text(errors.token_limit);
            }
            if (errors.wait_time) {
                $('#waitTimeError').text(errors.wait_time);
            }
            if (errors.ssl_tls) {
                $('#sslTlsError').text(errors.ssl_tls);
            }
            if (errors.api_key) {
                $('#apiKeyError').text(errors.api_key);
            }
            if (errors.bcc_email_1) {
                $('#bccEmail1Error').text(errors.bcc_email_1);
            }
            if (errors.bcc_email_2) {
                $('#bccEmail2Error').text(errors.bcc_email_2);
            }
        }
    });
};


function loadList() {
    var table = $('#settingTable').DataTable({
        "processing": false,
        "serverSide": true,
        "ajax": {
            "url": "/api/settings/",
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
            }
        },
        "columns": [
            {
                "data": null,
                "render": function (data, type, row) {
                    return `
                    <button type="button" class="btn btn-warning mx-1 btnupdate" data-toggle="modal" data-target="#exampleModal" data-id="${row.id}" onclick="getSettings(${row.id})" ><i class="bi bi-pencil-square"></i></button>
                <button class="btn btn-danger btn-delete mx-1" data-id="${row.id}"><i class="bi bi-trash-fill"></i></button>`;

                },
                "orderable": false,
                "width": "120px"

            },
            { "data": "id", "visible": false },
            { "data": "absender_name" },
            { "data": "absender_firma" },
            { "data": "absender_email" },
            { "data": "smtp_email" },
            { "data": "send_start_hour" },
            { "data": "send_end_hour" },

        ],
        "paging": true,  // Enable pagination
        "pageLength": 10,  // Default page size
        "serverMethod": "GET"
    });

    $('#projectSelect').change(function () {
        const selectedProjectId = $('#projectSelect').val();
        sessionStorage.setItem('projectId', selectedProjectId);
        table.ajax.reload();
    });
}


//clean the insert form
$('#insertModal').on('hidden.bs.modal', function () {
    $('#insertModal').find('input[type=text], input[type=email], input[type=password], input[type=number], input[type=url], textarea').val('');
    $('.error1').text('');
    $('#insertModal').find('input[type=checkbox]').prop('checked', false);
});
