import gevent
import requests

DETAIL_URL = 'http://cdn.animenewsnetwork.com/encyclopedia/api.xml?title='


class AnimeDetail:
    def __init__(self):
        pass

    def fetch_detail(self, id):
        r = requests.get(DETAIL_URL + str(id))
        return r.content

    def fetch_details(self, ids):
        r = requests.get(DETAIL_URL + str(ids))
        return r.content


if __name__ == '__main__':
    d = AnimeDetail()
    print d.fetch_detail(18138)
