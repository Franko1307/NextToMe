import time
import json
from datetime import datetime



with open('public/assets/json/items.json') as json_data:
    d = json.load(json_data)

while True:
    time.sleep(60*60*24)
    actual_time = datetime.now()
    for element in xrange(len(d["data"])):
        if "expiration_date" in d["data"][element]:
            if datetime.strptime(d["data"][element]["expiration_date"], '%d/%m/%Y') < actual_time:
                del d["data"][element]
    with open('public/assets/json/items.json', 'w') as outfile:
        json.dump(d, outfile)
