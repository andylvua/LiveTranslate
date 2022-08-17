// noinspection JSUnresolvedVariable,JSUnusedGlobalSymbols

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
(
    function worker() {
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
                            transcript_div.text(translated);
                        }
                        else
                        {
                            transcript_div.text(transcript);
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
)();