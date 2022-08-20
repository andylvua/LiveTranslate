import os
import threading

from flask import Flask, render_template, request
from LiveTranslate.speech_recognition import LiveTranslate

template_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'templates'))
app = Flask(__name__, template_folder=template_dir)

live_translate = LiveTranslate(speech_language='en-US')


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/start_listening', methods=['POST'])
def start_listening():
    live_translate.start_listening()
    return 'Listening...'


@app.route('/stop_listening', methods=['POST'])
def stop_listening():
    live_translate.stop_listening()
    return 'Stopped listening.'


@app.route('/set_language', methods=['POST'])
def set_language():
    language = request.form['language']
    live_translate.set_language(language)
    return 'OK'


@app.route('/set_translation_language', methods=['POST'])
def set_translation_language():
    language = request.form['language']
    live_translate.set_translation_language(language)
    return 'OK'


@app.route('/get_result', methods=['POST'])
def get_result():
    translate = (request.form.get('translate'))
    data = live_translate.get_result(translated=translate)

    result = data['result']

    transcript = ""
    translated = ""
    is_final = False

    if translate:
        translated = data["translated"]

    if result:
        transcript = result.alternatives[0].transcript if result.alternatives else ""
        is_final = result.is_final

    return {'transcript': transcript, 'is_final': is_final, 'translated': translated}


if __name__ == '__main__':
    app.run()
