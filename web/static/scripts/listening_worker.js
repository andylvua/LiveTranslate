// noinspection JSUnresolvedVariable,JSUnusedGlobalSymbols

function listening_worker() {
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
                setTimeout(listening_worker, 1000);
            },
        }
    );
}