#!/usr/bin/python3
import re
import time
import numpy

NUM_TESTS = 60

print("Measure wifi signal levels in 5 seconds")
time.sleep(5)

def read_signal():
    with open("/proc/net/wireless") as fp:
        lines = fp.readlines()
        for line in lines:
            match_obj = re.search(r'wlan0:\s*[^\s]*\s*[^\s]*\s*([^\s]*)', line)
            if match_obj:
                return(float(match_obj[1]))
    raise Exception("Unable to read /proc/net/wireless")

results = []

for i in range(NUM_TESTS):
    results.append(read_signal())
    time.sleep(1)

print(f"{len(results)} measurements")
print(f"Min:\t{min(results)}")
print(f"Max:\t{max(results)}")
print(f"Mean:\t{numpy.mean(results)}")
print(f"StdDev:\t{numpy.std(results)}")
print("Measurement done")
