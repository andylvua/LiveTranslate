let listening = false;

function toggle_listening() {
    if (listening) {
        stop_listening();
    } else {
        start_listening();
    }
}

function start_listening() {
    let validation = validate_selected_speech(true);
    if (!validation) {
        return;
    }

    if (listening) {
        alert("Already listening");
        return;
    }
    $.ajax(
        {
            url: '/start_listening',
            type: 'POST',
        }
    )

    let toggle_button = $('#toggle');
    toggle_button.removeClass('toggle_disabled');
    toggle_button.addClass('toggle_active');
    toggle_button.text("Stop listening");

    $('#language_selector').prop('disabled', true);

    $("#transcript").fadeOut(300, function() {
        $(this).text("Start speaking").fadeIn(300);
    });
    listening = true;
    listening_worker();
}

function stop_listening() {
    if (!listening) {
        alert("Not listening");
        return;
    }

    listening = false;

    $.ajax(
        {
            url: '/stop_listening',
            type: 'POST',
        }
    )

    let toggle_button = $('#toggle');
    toggle_button.removeClass('toggle_active');
    toggle_button.addClass('toggle_disabled');
    toggle_button.text("Start listening");

    $('#language_selector').prop('disabled', false);

    let transcript_div = $('#transcript');
    transcript_div.css('color', '#5d5d5d');

    animate_changes(transcript_div, "Stopped", 300, 1000,
        "Transcript will appear here");
}

let translate = "False";
function toggle_translate(){
    if (translate === "False") {
        translate = "True"
    }
    else if (translate === "True") {
        translate = "False"
    }

    console.log(translate)
}

