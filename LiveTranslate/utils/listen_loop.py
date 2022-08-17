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

            self.__print_result(result)

            if self.speak_results:
                self.speak_result()

            if re.search(r"\b(exit|quit)\b", transcript, re.I):
                print("Exiting..")
                break

    def __print_result(self, result):
        if result.is_final:
            print("\r" + self.transcript, end=" ✓")
            print("\n")
        else:
            sys.stdout.write('\r' + self.transcript)
            sys.stdout.flush()

    def __translate_result(self):
        return self.translator.translate(text=self.transcript)

    def speak_result(self):
        translated = self.__translate_result()
        TextToSpeech(translated).play_audio()

    def get_result(self, translated=False):
        result = {
            "result": self.result,
        }
        if translated:
            result["translated"] = self.__translate_result()

        return result
