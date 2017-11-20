#!/usr/bin/env python
# Name: Eline Rietdijk
# Student number: 10811834
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv

from pattern.web import URL, DOM, plaintext

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'
NUMBER_SERIES = 50



def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''

    # initialize 2d array big enoug to contain NUMBER_SERIES
    tv_series = []
    for a in range(NUMBER_SERIES):
        tv_series.append([])

    # initialize number variable to keep track of number of series
    number = 0

    for i in dom.by_tag("div.lister-item")[:NUMBER_SERIES]:

        # add serie title to tv_series
        tv_series[number].append(i.by_tag("div.lister-item-content")[0].by_tag("h3.lister-item-header")[0]
            .by_tag("a")[0].content.encode("UTF8"))

        # add serie rating to tv_series
        tv_series[number].append(i.by_tag("div.lister-item-content")[0].by_tag("div.ratings-bar")[0]
            .by_tag("div.inline-block")[0].by_tag("strong")[0].content.encode("UTF8"))

        # add serie genre to tv_series 
        tv_series[number].append(i.by_tag("div.lister-item-content")[0].by_tag("p.text-muted")[0]
            .by_tag("span.genre")[0].content.strip('\n').strip(" ").encode("UTF8"))

        # create string actors containing actors in serie
        actors = i.by_tag("div.lister-item-content")[0].by_tag("p")[2].by_tag("a")[0].content.encode('UTF8')
        for j in i.by_tag("div.lister-item-content")[0].by_tag("p")[2].by_tag("a")[1:]:
            actors = actors + ', ' + j.content.encode('UTF8')

        # add string actors to tv_series
        tv_series[number].append(actors) 

        # add runtime (in just numbers) to tv_series
        tv_series[number].append(i.by_tag("div.lister-item-content")[0]
            .by_tag("p.text-muted")[0].by_tag("span.runtime")[0].content.strip(" min").encode("UTF8"))
        
        # increase number
        number = number + 1
    return tv_series
    


def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # write tv serie information row by row
    for row in tvseries:
        writer.writerow(row)


    # ADD SOME CODE OF YOURSELF HERE TO WRITE THE TV-SERIES TO DISK

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)