from list import AnimeList

IDS_FILENAME = 'ids'

if __name__ == '__main__':

    # write ids to the file
    al = AnimeList()
    idstr = '\n'.join(al.ids())

    with open(IDS_FILENAME, 'w') as idf:
        idf.write(idstr)
