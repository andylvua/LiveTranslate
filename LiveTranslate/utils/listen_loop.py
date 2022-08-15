import re
import sys

from LiveTranslate.utils.text_to_speech import TextToSpeech
from LiveTranslate.utils.translator import Translator


def listen_loop(responses):
    for response in responses:
        if not response.results:
            continue

        result = response.results[0]
        if not result.alternatives:
            continue

        transcript = result.alternatives[0].transcript

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
