function set_language(selectObject) {
    let language = selectObject.value;
    let language_name = selectObject.options[selectObject.selectedIndex].text.split(" ")[0];

    let transcript_div = $('#transcript');

    animate_changes(transcript_div, "Language set to " + language_name, 300, 1000);

    let toggle_button = $('#toggle');
    toggle_button.removeClass('toggle_active');
    toggle_button.addClass('toggle_disabled');

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
