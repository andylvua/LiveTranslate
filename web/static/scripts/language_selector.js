$(function() {
    console.log("Language selector loaded")

    let language_selector = $('#language_selector');
    let request = new XMLHttpRequest();
    request.open("GET", "../../static/assets/speech_supported_languages.json", false);
    request.send(null)
    let data = JSON.parse(request.responseText);

    let toAppend = '';
    $.each(data,function(language, code){
       language_selector.append('<option value='+code+'>'+language+'</option>');
    });
})