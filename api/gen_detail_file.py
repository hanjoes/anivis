import timeit

import gevent
import math
from gevent.queue import Queue

from detail import AnimeDetail
from gen_id_file import IDS_FILENAME

from gevent import monkey; monkey.patch_socket()

DETAILS_FILENAME = 'animes.xml'
BATCH_SIZE = 10
WORKER_NUM = 8
MAXIMUM_WORKER_NUM = 8
NAMES_FOR_WORKER = ['Joe', 'Adam', 'Matt', 'Bob', 'Sam', 'Mary', 'Jack', 'Peter']
FILE_SUFFIX = '_batch.xml'

# stores tuple like (start, end)
tasks = Queue()


def worker(name, work):
    with open(name + FILE_SUFFIX, 'w') as f:
        f.write('<root>')
        gevent.sleep(0)
        ad = AnimeDetail()
        while not tasks.empty():
            task = tasks.get()
            request = '/'.join([id.strip() for id in work[task[0]:task[1]]])
            print name + ' woke up doing work.. ' + request
            batch_data = ad.fetch_details(request)
            f.write(batch_data)
        f.write('</root>')


def boss(name, work):
    print name + ' woke up...'
    count = 0
    for i in range(int(math.ceil(float(len(work)) / BATCH_SIZE))):
        start = i * BATCH_SIZE
        end = min((i + 1) * BATCH_SIZE, len(work))
        tasks.put((start, end))
        count += 1
    print 'Work has been divided into ' + str(count) + ' batches.'


def process(list, num_workers):
    # make sure worker num doesn't exceeds limitation
    num_workers = min(num_workers, MAXIMUM_WORKER_NUM)

    # boss starts
    gevent.spawn(boss, 'Terence', work).join()

    # workers start
    gevent.joinall([gevent.spawn(worker, NAMES_FOR_WORKER[i], work) for i in range(num_workers)])

if __name__ == '__main__':
    # put all details into string
    ad = AnimeDetail()
    work = []
    try:
        with open(IDS_FILENAME, 'r') as idsf:
            work = [id for id in idsf]
    except IOError as e:
        print 'Please run gen_id_file.py first.'

    start = timeit.default_timer()
    process(work, WORKER_NUM)
    stop = timeit.default_timer()
    print 'It took ' + str(stop - start) + 's to run ' + str(len(work)) + ' queries.'
