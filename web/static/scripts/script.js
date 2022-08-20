// noinspection JSUnresolvedVariable,JSUnusedGlobalSymbols

let listening = false;

function validate_selected_speech(animate)
{
    function animate_error(element) {
       element.fadeOut(150).fadeIn(150).fadeOut(150).fadeIn(150).fadeOut(150).fadeIn(150);
        }


    let language_selector = document.getElementById("language_selector");
    let selected_value = language_selector.options[language_selector.selectedIndex].value;
    if (selected_value === "Select speech language") {
        let selector_jq = $('#language_selector');
        if(animate) {
            animate_error(selector_jq);
        }
        // selector_jq.css('background', '#333333');
        return false;
    }
    return true;
}

function animate_changes (element, text, speed, delay, initial_text) {
    if (initial_text === undefined) {
        initial_text = element.text();
    }

    element.fadeOut(speed, function() {
        $(this).text(text).fadeIn(speed, function() {
            $(this).delay(delay).fadeOut(speed, function() {
                $(this).text(initial_text).fadeIn(speed);
            });
        });
    });
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

    $('#stop_button').fadeIn(300);
    $('#language_selector').prop('disabled', true);

    $("#transcript").fadeOut(300, function() {
        $(this).text("Start speaking").fadeIn(300);
    });
    listening = true;
    worker();
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

    $('#stop_button').fadeOut(300);
    $('#language_selector').prop('disabled', false);

    let transcript_div = $('#transcript');
    transcript_div.css('color', '#5d5d5d');

    let transcript_placeholder = transcript_div.text();
    animate_changes(transcript_div, "Stopped", 300, 1000, transcript_placeholder);
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

function set_language(selectObject) {
    let language = selectObject.value;
    let language_name = selectObject.options[selectObject.selectedIndex].text.split(" ")[0];

    let transcript_div = $('#transcript');

    animate_changes(transcript_div, "Language set to " + language_name, 300, 1000);

    console.log(language)
    $.ajax(
        {
            url: '/set_language',
            type: 'POST',
            data: {
                'language': language
            }
        }
    )
}

function set_translation_language(selectObject) {
    let language = selectObject.value;

    console.log(language)
    $.ajax(
        {
            url: '/set_translation_language',
            type: 'POST',
            data: {
                'language': language
            }
        }
    )
}

function worker() {
    function animate(element, text, speed) {
        if(element.text() !== text) {
            element.fadeOut(speed, function () {
                element.text(text).fadeIn(speed);
            });
        }
    }
    if (!listening) {
        return;
    }
    $.ajax(
        {
            url: '/get_result',
                type: 'POST',
                data: {
                    'translate': translate
                },
            success: function(data) {
                let transcript = data.transcript;
                let is_final = data.is_final;
                let translated = data.translated;
                let transcript_div = $('#transcript');

                if (transcript) {
                    if(translate === "True")
                    {
                        animate(transcript_div, translated, 100);
                    }
                    else
                    {
                        animate(transcript_div, transcript, 100);
                    }

                    if (is_final) {
                        transcript_div.css('color', '#57b639');
                    } else {
                        transcript_div.css('color', '#5d5d5d');
                    }
                }
            },
            complete: function() {
                // Schedule the next request when the current one's complete
                setTimeout(worker, 1000);
            },
        }
    );
}
