import scrapy
import urllib
from politician_scrapper.model import Politician


class PoliticianSpider(scrapy.Spider):
    name = 'politician'

    start_urls = ['https://en.wikipedia.org/wiki/List_of_current_United_States_senators']

    def parse(self, response):
        rows = response.css('table#senators tbody tr')
        for row in rows:
            politician_name = row.css('th a::text').get()
            party = row.css('td:nth-last-child(7)').css('a::text').get()
            img = row.css('td:nth-last-child(10) a').xpath('@href').get()

            if politician_name is None:
                continue

            politician = Politician(politician_name, party, img)
            print(politician)
            img_page = 'https://en.wikipedia.org' + str(img)

            yield scrapy.Request(url=img_page, callback=self.callback_factory(politician_name))

    def callback_factory(self, politician):
        return lambda x: self.parse_sub_page(x, politician)

    def parse_sub_page(self, response, politician_name):
        img = response.css('.fullImageLink img').xpath('@src').get()
        img = 'https:' + img

        try:
            PoliticianSpider.download_image(img, politician_name)
        except Exception as er:
            print('error ', er)

    @staticmethod
    def download_image(img, politician_name):
        urllib.request.urlretrieve(str(img), str(politician_name).replace(' ', '_') + '.jpg')
