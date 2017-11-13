#################################################
# Name: Eline Rietdijk
# Studentnumber: 10811834
# Project: D3 Barchart

# 'convertCSV2JSON.py'
# This file converts CSV file to JSON object
#################################################

import csv
import json

# # open csvfile to read and jsonfile to write
csvfile = open('#date,maxTemp.csv', 'r')
jsonfile = open('rawData.json', 'w')

# iterate over rows in csvfile
reader = csv.DictReader(csvfile)
for row in reader:
	# write each row as jason object on a new line
	json.dump(row, jsonfile)
	jsonfile.write('\n')
    


