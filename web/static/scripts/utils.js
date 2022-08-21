function validate_selected_speech(animate)
{
    let language_selector = document.getElementById("language_selector");
    let selected_value = language_selector.options[language_selector.selectedIndex].value;
    if (selected_value === "Select speech language") {
        let selector_jq = $('#language_selector');
        if (animate) {
            selector_jq.effect("shake", {times: 2}, 300);
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