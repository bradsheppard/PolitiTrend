import scrapy
import urllib
from ..model.politician import Politician


class PoliticianSpider(scrapy.Spider):
    name = 'politician'

    url = 'https://en.wikipedia.org/wiki/List_of_current_United_States_senators'

    def start_requests(self):
        urls = [
            PoliticianSpider.url
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        rows = response.css('table#senators tbody tr')
        for row in rows:
            name = row.css('th a::text').get()
            party = row.css('td:nth-last-child(7)').css('a::text').get()
            img = row.css('img').xpath('@src').get()

            politician = Politician(name, party, img)
            img_search = 'https:' + str(img)
            print(img_search)
            try:
                self.download_image(name, img_search)
            except Exception as er:
                print('error ', er)
            print(politician)

    @staticmethod
    def download_image(name, img):
        urllib.request.urlretrieve(str(img), str(name).replace(' ', '_') + '.jpg')
