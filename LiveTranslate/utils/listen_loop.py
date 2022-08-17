import re
import sys

from LiveTranslate.utils.text_to_speech import TextToSpeech
from LiveTranslate.utils.translator import Translator


class ListenLoop:
    def __init__(self, speak_results):
        self.responses = None
        self.speak_results = speak_results
        self.result = None
        self.transcript = ""
        self.translator = Translator()

    def start(self):
        self.__listen_loop()

    def configure(self, responses):
        self.responses = responses

    def __listen_loop(self):
        for response in self.responses:
            if not response.results:
                continue

            result = response.results[0]
            if not result.alternatives:
                continue

            self.result = result

            transcript = result.alternatives[0].transcript
            self.transcript = transcript

        print_result(result, transcript)

        if re.search(r"\b(exit|quit)\b", transcript, re.I):
            print("Exiting..")
            break


def print_result(result, transcript):
    if result.is_final:
        print("\r" + transcript, end=" ✓")
        print("\n")

        speak_result(transcript)
    else:
        sys.stdout.write('\r' + transcript)
        sys.stdout.flush()


def speak_result(transcript):
    translated = Translator().translate(text=transcript)
    TextToSpeech(translated).play_audio()
