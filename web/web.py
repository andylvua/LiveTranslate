import os
import threading

from flask import Flask, render_template, request
from LiveTranslate.speech_recognition import LiveTranslate

template_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'templates'))
app = Flask(__name__, template_folder=template_dir)

live_translate = LiveTranslate(speech_language='en-US')
listening = threading.Thread(target=live_translate.start_listening)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/start_listening', methods=['POST'])
def start_listening():
    if not listening.is_alive():
        listening.start()
    return 'Listening...'


@app.route('/set_language', methods=['POST'])
def set_language():
    language = request.form['language']
    live_translate.set_language(language)
    return 'OK'


@app.route('/get_result', methods=['POST'])
def get_result():
    translate = (request.form.get('translate'))
    print(translate)
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
