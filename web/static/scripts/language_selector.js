$(function() {
    let language_selector = $('#language_selector');
    let request = new XMLHttpRequest();
    request.open("GET", "../../static/assets/speech_supported_languages.json", false);
    request.send(null)
    let data = JSON.parse(request.responseText);

    $.each(data,function(language, code){
       language_selector.append('<option value='+code+'>'+language+'</option>');
    });
})

$(function() {
    let translation_language_selector = $('#translate_language_selector');
    let request = new XMLHttpRequest();
    request.open("GET", "../../static/assets/translate_supported_languages.json", false);
    request.send(null)
    let data = JSON.parse(request.responseText);

    $.each(data,function(language, code){
       translation_language_selector.append('<option value='+code+'>'+language+'</option>');
    });
})