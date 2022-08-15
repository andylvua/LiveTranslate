from LiveTranslate.speech_recognition import LiveTranslate


def main():
    # Create a LiveTranslate object
    live_translate = LiveTranslate(speech_language='en-US')
    # Start listening from the microphone
    live_translate.start_listening()


if __name__ == "__main__":
    main()
