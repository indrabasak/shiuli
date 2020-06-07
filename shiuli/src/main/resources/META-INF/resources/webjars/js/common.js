function logit(message, style) {
    if (style) {
        $("#log").append('<span class="' + style + '">' + message + '</span><br>');
    } else {
        $("#log").append('<span class="default_log">' + message + '</span><br>');
    }
}

function clearLog() {
    $("#log").empty();
}

function processFlow(outMessage, url, formatter) {
    clearLog();
    logit(outMessage, "out_log");
    processRequest(url, formatter);
}

function processRequest(url, formatter) {
    $.ajax({
        url: url,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-Requested-With', 'BasicAuthClient');
        },
        success: function (data) {
            if (formatter) {
                formatter(data);
            } else {
                logit(data, "in_log");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            logit("FAILURE: " + xhr.status + "\nERROR: " + thrownError, "in_log");
        },
        async: false
    });
}

function formatVersion(json) {
    logit("Name: " + json.name, "in_log");
    logit("Version: " + json.version, "in_log");
    logit("Number: " + json.number, "in_log");
    logit("Date: " + json.date, "in_log");
}

function dateToISO8601(d) {
    function zeropad(n) {
        return (n < 10) ? '0' + n : n
    }

    return d.getUTCFullYear() + '-'
        + zeropad(d.getUTCMonth() + 1) + '-'
        + zeropad(d.getUTCDate()) + 'T'
        + zeropad(d.getUTCHours()) + ':'
        + zeropad(d.getUTCMinutes()) + ':'
        + zeropad(d.getUTCSeconds()) + '.'
        + zeropad(d.getUTCMilliseconds()) + 'Z'
}
// var d = new Date();
// print(dateToISO8601(d));

function show_log() {
    var logDiv = document.getElementById('log');
    logDiv.style.display = 'block';
}

function show_welcome() {
    $("#log").empty();
    var message = 'Welcome to Token Service';
    $("#log").append('<h1>' + message + '</h1>');
}

function formatString(json) {
    logit(JSON.stringify(json, null, 2), null);
}

$(function () {
    $('li a').click(function () {
        $('li a').each(function (a) {
            $(this).removeClass('selectedclass')
        });
        $(this).addClass('selectedclass');
    });

    $('ul a').click(function () {
        $('ul a').each(function (a) {
            $(this).removeClass('selectedclass')
        });
        $(this).addClass('selectedclass');
    });
});