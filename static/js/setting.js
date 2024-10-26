var projectId = 0;

$(document).ready(function () {
    loadList();
    getprojectid();

    $(document).on('click', '.btn-delete', function () {
        const settingId = $(this).data('id');

        if (confirm("Are you sure you want to delete this record?")) {
            $.ajax({
                url: `/api/settings/${settingId}/`,
                method: 'DELETE',
                success: function (response) {
                    console.log("Data deleted successfully.");
                    const table = $('#settingTable').DataTable();
                    table.row($(this).parents('tr')).remove().draw();
                    getprojectid();
                },
                error: function (error) {
                    console.log("Error deleting the settings.");
                }
            });
        }
    });

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
    
        let hasErrors = false;
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let phoneRegex = /^[0-9\s\-]+$/;
    
        $('.error1').text('');
    
        // Validate each field (example validations)
        if (!absenderName.trim()) {
            $('#absenderNameError1').text('Absender Name is required.');
            hasErrors = true;
        }
    
        if (!absenderFirma.trim()) {
            $('#absenderFirmaError1').text('Absender Firma is required.');
            hasErrors = true;
        }
    
        if (!absenderStrasse.trim()) {
            $('#absenderStrasseError1').text('Absender Strasse is required.');
            hasErrors = true;
        }
    
        if (!absenderPlz.trim()) {
            $('#absenderPlzError1').text('Absender PLZ is required.');
            hasErrors = true;
        }
    
        if (!absenderTelefon.trim()) {
            $('#absenderTelefonError1').text('Absender Telefon is required.');
            hasErrors = true;
        }
    
        if (!absenderEmail.trim()) {
            $('#absenderEmailError1').text('Absender Email is required.');
            hasErrors = true;
        }
    
        if (!smtpEmail.trim()) {
            $('#smtpEmailError1').text('SMTP Email is required.');
            hasErrors = true;
        }
    
        if (!smtpName.trim()) {
            $('#smtpNameError1').text('SMTP Name is required.');
            hasErrors = true;
        }
    
        if (!smtpPassword.trim()) {
            $('#smtpPasswordError1').text('SMTP Password is required.');
            hasErrors = true;
        }
    
        if (!smtpServer.trim()) {
            $('#smtpServerError1').text('SMTP Server is required.');
            hasErrors = true;
        }
    
        if (!smtpPort) {
            $('#smtpPortError1').text('SMTP Port is required.');
            hasErrors = true;
        }
    
        if (!arbeitsaufgabe.trim()) {
            $('#arbeitsaufgabeError1').text('Arbeitsaufgabe is required.');
            hasErrors = true;
        }
    
        if (!betreffAufgabe.trim()) {
            $('#betreffAufgabeError1').text('Betreff Aufgabe is required.');
            hasErrors = true;
        }
    
        if (!tokenLimit) {
            $('#tokenLimitError1').text('Token Limit is required.');
            hasErrors = true;
        }
    
        if (!apiKey.trim()) {
            $('#apiKeyError1').text('API Key is required.');
            hasErrors = true;
        }
    
        if (!absenderHomepage.trim()) {
            $('#absenderHomepageError1').text('Absender Homepage is required.');
            hasErrors = true;
        }
    

    
        if (!waitTime) {
            $('#waitTimeError1').text('Wait Time is required.');
            hasErrors = true;
        }
    
        if (!sendStartHour) {
            $('#sendStartHourError1').text('Send Start Hour is required.');
            hasErrors = true;
        }
    
        if (!sendEndHour) {
            $('#sendEndHourError1').text('Send End Hour is required.');
            hasErrors = true;
        }
    
        if (!maxWorkers) {
            $('#maxWorkersError1').text('Max Workers is required.');
            hasErrors = true;
        }
    
        if (!debug) {
            $('#debugError1').text('Debug is required.');
            hasErrors = true;
        }
    
        if (!projektId) {
            $('#projektIdError1').text('Projekt ID is required.');
            hasErrors = true;
        }
    
        if (!absenderName.trim()) {
            $('#absenderNameError1').text('Absender Name is required.');
            hasErrors = true;
        } else if (absenderName.length < 2 || absenderName.length > 50) {
            $('#absenderNameError1').text('Absender Name must be between 2 and 50 characters.');
            hasErrors = true;
        }
    
        if (!absenderFirma.trim()) {
            $('#absenderFirmaError1').text('Absender Firma is required.');
            hasErrors = true;
        }
    
        if (!absenderStrasse.trim()) {
            $('#absenderStrasseError1').text('Absender Strasse is required.');
            hasErrors = true;
        }
    
        if (!absenderPlz.trim()) {
            $('#absenderPlzError1').text('Absender PLZ is required.');
            hasErrors = true;
        } else if (!/^\d{5}$/.test(absenderPlz)) { // Assuming PLZ is a 5-digit number
            $('#absenderPlzError1').text('Absender PLZ must be a 5-digit number.');
            hasErrors = true;
        }
    
        if (!absenderTelefon.trim()) {
            $('#absenderTelefonError1').text('Absender Telefon is required.');
            hasErrors = true;
        } else if (!phoneRegex.test(absenderTelefon)) {
            $('#absenderTelefonError1').text('Absender Telefon must be a valid phone number.');
            hasErrors = true;
        }
    
        if (!absenderEmail.trim()) {
            $('#absenderEmailError1').text('Absender Email is required.');
            hasErrors = true;
        } else if (!emailRegex.test(absenderEmail)) {
            $('#absenderEmailError1').text('Absender Email must be a valid email address.');
            hasErrors = true;
        }
    
        if (!smtpEmail.trim()) {
            $('#smtpEmailError1').text('SMTP Email is required.');
            hasErrors = true;
        } else if (!emailRegex.test(smtpEmail)) {
            $('#smtpEmailError1').text('SMTP Email must be a valid email address.');
            hasErrors = true;
        }
    
        // Continue with similar validations for other fields...
    
        if (!smtpPort || smtpPort <= 0 || smtpPort > 65535) {
            $('#smtpPortError1').text('SMTP Port must be a valid port number (1-65535).');
            hasErrors = true;
        }
    
        if (!tokenLimit || tokenLimit <= 0) {
            $('#tokenLimitError1').text('Token Limit must be greater than zero.');
            hasErrors = true;
        }
    
        if (!absenderHomepage.trim()) {
            $('#absenderHomepageError1').text('Absender Homepage is required.');
            hasErrors = true;
        } else if (!/^https?:\/\//.test(absenderHomepage)) {
            $('#absenderHomepageError1').text('Absender Homepage must start with http:// or https://.');
            hasErrors = true;
        }
    
        if (hasErrors) {
            return;
        }
    
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
    
                $('#settingTable').DataTable().ajax.reload();
                // Clear the form after successful submission
                $('input[type=text], input[type=email], input[type=password], input[type=number], textarea').val('');
                $('#sslTls').prop('checked', false);
                $('#closebutton1').click();
                getprojectid();
                
            },
            error: function (xhr) {
                const errors = xhr.responseJSON.error || "An error occurred. Please try again.";
                console.log(errors);
            }
        });
        
    });
});


function loadList() {
    var table = $('#settingTable').DataTable({
        "processing": true,
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
        table.ajax.reload();
    });
}



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
            // document.getElementById('smtpPassword').value = settings.smtp_password;
            document.getElementById('smtpServer').value = settings.smtp_server;
            document.getElementById('smtpPort').value = settings.smtp_port;
            document.getElementById('arbeitsaufgabe').value = settings.arbeitsaufgabe;
            document.getElementById('betreffAufgabe').value = settings.betreff_aufgabe;
            document.getElementById('tokenLimit').value = settings.token_limit;
            // document.getElementById('apiKey').value = settings.api_key;
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
    fetch(`/api/settings/data/`, {  
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
                option.textContent = `${setting.absender_name} (${setting.projekt_id})`; // Set the text to ceo_name and projekt_id
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



    let hasErrors = false;
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let phoneRegex = /^[0-9\s\-]+$/;

    $('.error').text('');

    // Validate each field (example validations)
    if (!absenderName.trim()) {
        $('#absenderNameError').text('Absender Name is required.');
        hasErrors = true;
    }

    if (!absenderFirma.trim()) {
        $('#absenderFirmaError').text('Absender Firma is required.');
        hasErrors = true;
    }

    if (!absenderStrasse.trim()) {
        $('#absenderStrasseError').text('Absender Strasse is required.');
        hasErrors = true;
    }

    if (!absenderPlz.trim()) {
        $('#absenderPlzError').text('Absender PLZ is required.');
        hasErrors = true;
    }

    if (!absenderEmail.trim()) {
        $('#absenderEmailError').text('Absender Email is required.');
        hasErrors = true;
    }

    if (!smtpEmail.trim()) {
        $('#smtpEmailError').text('SMTP Email is required.');
        hasErrors = true;
    }

    if (!smtpName.trim()) {
        $('#smtpNameError').text('SMTP Name is required.');
        hasErrors = true;
    }

    if (!smtpPassword.trim()) {
        $('#smtpPasswordError').text('SMTP Password is required.');
        hasErrors = true;
    }

    if (!smtpServer.trim()) {
        $('#smtpServerError').text('SMTP Server is required.');
        hasErrors = true;
    }

    if (!smtpPort) {
        $('#smtpPortError').text('SMTP Port is required.');
        hasErrors = true;
    }

    if (!arbeitsaufgabe.trim()) {
        $('#arbeitsaufgabeError').text('Arbeitsaufgabe is required.');
        hasErrors = true;
    }

    if (!betreffAufgabe.trim()) {
        $('#betreffAufgabeError').text('Betreff Aufgabe is required.');
        hasErrors = true;
    }

    if (!tokenLimit) {
        $('#tokenLimitError').text('Token Limit is required.');
        hasErrors = true;
    }

    if (!apiKey.trim()) {
        $('#apiKeyError').text('API Key is required.');
        hasErrors = true;
    }

    if (!absenderHomepage.trim()) {
        $('#absenderHomepageError').text('Absender Homepage is required.');
        hasErrors = true;
    }

    if (!waitTime) {
        $('#waitTimeError').text('Wait Time is required.');
        hasErrors = true;
    }

    if (!sendStartHour) {
        $('#sendStartHourError').text('Send Start Hour is required.');
        hasErrors = true;
    }

    if (!sendEndHour) {
        $('#sendEndHourError').text('Send End Hour is required.');
        hasErrors = true;
    }

    if (!maxWorkers) {
        $('#maxWorkersError').text('Max Workers is required.');
        hasErrors = true;
    }

    if (!debug) {
        $('#debugError').text('Debug is required.');
        hasErrors = true;
    }

    if (!projektId) {
        $('#projektIdError').text('Projekt ID is required.');
        hasErrors = true;
    }

    if (!absenderName.trim()) {
        $('#absenderNameError').text('Absender Name is required.');
        hasErrors = true;
    } else if (absenderName.length < 2 || absenderName.length > 50) {
        $('#absenderNameError').text('Absender Name must be between 2 and 50 characters.');
        hasErrors = true;
    }

    if (!absenderFirma.trim()) {
        $('#absenderFirmaError').text('Absender Firma is required.');
        hasErrors = true;
    }

    if (!absenderStrasse.trim()) {
        $('#absenderStrasseError').text('Absender Strasse is required.');
        hasErrors = true;
    }


    if (!phoneRegex.test(absenderTelefon)) {
        $('#absenderTelefonError').text('Absender Telefon must be a valid phone number.');
        hasErrors = true;
    }

    if (!absenderEmail.trim()) {
        $('#absenderEmailError').text('Absender Email is required.');
        hasErrors = true;
    } else if (!emailRegex.test(absenderEmail)) {
        $('#absenderEmailError').text('Absender Email must be a valid email address.');
        hasErrors = true;
    }

    if (!smtpEmail.trim()) {
        $('#smtpEmailError').text('SMTP Email is required.');
        hasErrors = true;
    } else if (!emailRegex.test(smtpEmail)) {
        $('#smtpEmailError').text('SMTP Email must be a valid email address.');
        hasErrors = true;
    }

    // Continue with similar validations for other fields...

    if (!smtpPort || smtpPort <= 0 || smtpPort > 65535) {
        $('#smtpPortError').text('SMTP Port must be a valid port number (1-65535).');
        hasErrors = true;
    }

    if (!tokenLimit || tokenLimit <= 0) {
        $('#tokenLimitError').text('Token Limit must be greater than zero.');
        hasErrors = true;
    }

    // Add additional checks as needed for other fields
    if (!absenderHomepage.trim()) {
        $('#absenderHomepageError').text('Absender Homepage is required.');
        hasErrors = true;
    } 

    if (hasErrors) {
        return;
    }


    $('#closebutton').click();

    fetch(`/api/settings/${projectId}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.msg) {
            $('#settingTable').DataTable().ajax.reload();
            getprojectid();
        } else {
            console.log('Failed to update the project. Error: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}