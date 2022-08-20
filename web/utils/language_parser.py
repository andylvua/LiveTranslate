import json

import bs4
import cloudscraper as cloudscraper

SPEECH_SUPPORTED_LANGUAGES = 'https://cloud.google.com/speech-to-text/docs/languages'
TRANSLATION_SUPPORTED_LANGUAGES = 'https://cloud.google.com/translate/docs/languages'


def parse_supported_languages(target_url):
    scraper = cloudscraper.create_scraper()
    request_result = scraper.get(target_url)

    soup = bs4.BeautifulSoup(request_result.text, "html.parser")

    data = {}
    table_div = soup.find('div', {'id': 'lang-table-container'})
    try:
        table = table_div.find('table')
    except AttributeError:
        table = soup.find('table')

    table_body = table.find('tbody')

    rows = table_body.find_all('tr')
    for row in rows:
        cols = row.find_all('td')
        cols = [element.text.strip() for element in cols]
        data[cols[0]] = cols[1]

    with open(f'../static/assets/{target_url.split("/")[-3]}_supported_languages.json', 'w') as outfile:
        json.dump(data, outfile)


parse_supported_languages(TRANSLATION_SUPPORTED_LANGUAGES)
parse_supported_languages(SPEECH_SUPPORTED_LANGUAGES)
