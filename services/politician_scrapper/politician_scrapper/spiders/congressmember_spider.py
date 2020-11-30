import scrapy
import urllib

from politician_scrapper.model import Politician


class CongressmemberSpider(scrapy.Spider):
    name = 'congressmember'

    start_urls = ['https://en.wikipedia.org/wiki/List_of_current_members_of_the_United_States_House_of_Representatives']

    def parse(self, response):
        rows = response.css('table#votingmembers tbody tr')
        for row in rows:
            politician_name = row.css('td:nth-child(2) b a::text').get()
            party = row.css('td:nth-child(4)::text').get()
            img = row.css('td:nth-child(2) a').xpath('@href').get()

            if politician_name is None:
                continue

            politician = Politician(politician_name, party, img)
            print(politician.name + ',' + politician.party)
            img_page = 'https://en.wikipedia.org' + str(img)

            yield scrapy.Request(url=img_page, callback=self.callback_factory(politician_name))

    @staticmethod
    def callback_factory(politician):
        return lambda x: CongressmemberSpider.parse_sub_page(x, politician)

    @staticmethod
    def parse_sub_page(response, politician_name):
        img = response.css('.fullImageLink img').xpath('@src').get()
        img = 'https:' + img

        try:
            CongressmemberSpider.download_image(img, politician_name)
        except Exception as er:
            print('error ', er)

    @staticmethod
    def download_image(img, politician_name):
        urllib.request.urlretrieve(str(img), 'images/congressmembers/' + str(politician_name).replace(' ', '_') + '.jpg')
