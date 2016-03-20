import requests
import xml.etree.ElementTree as ET

LIST_URL = 'http://www.animenewsnetwork.com/encyclopedia/reports.xml?id=155&nlist=all'

class AnimeList:

    def __init__(self):
        pass

    def ids(self):
        res = []

        r = requests.get(LIST_URL)
        root = ET.fromstring(r.content)
        for item in root.iter('item'):
            id = item.find('id')
            res.append(id.text)

        return res


if __name__ == '__main__':

    list = AnimeList()
    print list.ids()

