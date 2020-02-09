from crawler.news.news_crawler import NewsCrawler
import json

crawler = NewsCrawler('46bbe43074mshfbe85df481ea511p1157adjsn45e2d52805e8')

result = crawler.get('Donald Trump')
body = json.loads(result)

print('Done')
