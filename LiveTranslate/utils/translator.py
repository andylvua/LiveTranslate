import configparser

import six
from google.cloud import translate_v2 as translate

config = configparser.ConfigParser()
config.read('config.ini')

target_language = config['Text-to-Speech']['language_code'].split('-')[0]


class Translator:
    def __init__(self):
        self.translate_client = translate.Client()
        self.target_language = target_language

    def translate(self, text):
        if isinstance(text, six.binary_type):
            text = text.decode("utf-8")

        result = self.translate_client.translate(
            values=text,
            target_language=self.target_language,
        )

        return result['translatedText']
