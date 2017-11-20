#################################################
# Name: Eline Rietdijk
# Studentnumber: 10811834
# Project: D3 Barchart

# 'convertCSV2JSON.py'
# This file converts CSV file to JSON object
#################################################

import csv
import json

# open csvfile to read and jsonfile to write
csvfile = open('rawData.csv', 'r')
jsonfile = open('rawData.json', 'w')

# count rows in csvfile
reader = csv.DictReader(csvfile)
rowCount = sum(1 for row in reader)

# open file again to read file again
csvfile = open('rawData.csv', 'r')
reader = csv.DictReader(csvfile)

counter = 0

# iterate over rows in csvfile
for row in reader:
	# use counter to keep track of number of row 
	counter += 1

	# at the first row, first print [
	if counter == 1:
		jsonfile.write('[')

	# write each row as jason object on a new line
	json.dump(row, jsonfile)

	# print ',' at the end of each line except for last one
	if not counter == rowCount:
		jsonfile.write(',')

	# print ] at the end of the last line
	else: 
		jsonfile.write(']'

	# start new line at the end of each line
	jsonfile.write('\n')


    


