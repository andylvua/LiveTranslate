// noinspection JSUnresolvedVariable,JSUnusedGlobalSymbols

let listening = false;

function validate_selected_speech()
{
    let language_selector = document.getElementById("language_selector");
    let selected_value = language_selector.options[language_selector.selectedIndex].value;
    if (selected_value === "Select speech language") {
        alert("Please select a speech language");
        return false;
    }
    return true;
}

function start_listening() {
    let validation = validate_selected_speech();
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

    alert("Listening started")
    listening = true;
    worker();
}

function stop_listening() {
    if (!listening) {
        alert("Not listening");
        return;
    }
    alert("Listening stopped")
    listening = false;
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
