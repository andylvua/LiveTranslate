import io
import configparser

from google.cloud import texttospeech

import simpleaudio as sa


config = configparser.ConfigParser()
config.read('config.ini')

language_code = config['Text-to-Speech']['language_code']
name = config['Text-to-Speech']['name']


class TextToSpeech:
    def __init__(self, text):
        self.client = texttospeech.TextToSpeechClient()
        self.synthesis_input = texttospeech.SynthesisInput(text=text)

        self.voice = texttospeech.VoiceSelectionParams(
            {
                "language_code": language_code,
                "name": name,
            }
        )

        self.audio_config = texttospeech.AudioConfig(
            {
                "audio_encoding": texttospeech.AudioEncoding.LINEAR16,
            }
        )

        self.audio = self.__get_response_audio_content()

    def __get_response_audio_content(self):
        response = self.client.synthesize_speech(
            input=self.synthesis_input,
            voice=self.voice,
            audio_config=self.audio_config
        )

        return response.audio_content

    def play_audio(self):
        wave_obj = sa.WaveObject.from_wave_file(io.BytesIO(self.audio))
        wave_obj.play()
