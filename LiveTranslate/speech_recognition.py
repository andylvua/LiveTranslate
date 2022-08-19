from __future__ import division

import os

from google.cloud import speech

from LiveTranslate.utils.microphone_stream import MicrophoneStream
from LiveTranslate.utils.listen_loop import ListenLoop

# Audio recording parameters
RATE = 16000
CHUNK = int(RATE / 10)

# Use the following environment variable to configure the client using Google credentials:
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "credentials.json"
# Disable verbose logging
os.environ["GRPC_ENABLE_FORK_SUPPORT"] = "False"


class LiveTranslate:
    def __init__(self, speech_language, speak_results=False):
        self.client = speech.SpeechClient()

        self.config = speech.RecognitionConfig(
            {
                "encoding": speech.RecognitionConfig.AudioEncoding.LINEAR16,
                "sample_rate_hertz": RATE,
                "language_code": speech_language,
                "enable_automatic_punctuation": True,
            }
        )

        self.streaming_config = speech.StreamingRecognitionConfig(
            {
                "config": self.config,
                "interim_results": True,
            }
        )

        self.listen_loop = ListenLoop(speak_results=speak_results)

    def set_language(self, language):
        self.streaming_config.config.language_code = language
        print("Language set to {}".format(language))

    def start_listening(self):
        print("Listening...")

        with MicrophoneStream(RATE, CHUNK) as stream:
            audio_generator = stream.generator()
            requests = (
                speech.StreamingRecognizeRequest(audio_content=content)
                for content in audio_generator
            )

            # noinspection PyArgumentList
            responses = self.client.streaming_recognize(self.streaming_config, requests)

            self.listen_loop.configure(responses)
            self.listen_loop.start()

    def get_result(self, translated=False):
        return self.listen_loop.get_result(translated=translated)
