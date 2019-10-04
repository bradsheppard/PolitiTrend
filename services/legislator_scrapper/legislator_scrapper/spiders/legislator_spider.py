import scrapy


class LegislatorSpider(scrapy.Spider):
    name = 'legislator'

    def start_requests(self):
        urls = [
            'https://en.wikipedia.org/wiki/List_of_current_United_States_senators',
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        rows = response.css('table#senators tbody tr')
        for row in rows:
            name = row.css('th span::attr(data-sort-value)').get()

            party = row.css('td:nth-child(5)').css('a::text').get()
            print(str(name) + ", " + str(party))
