# from datetime import datetime
from bs4 import BeautifulSoup
from datetime import datetime, timezone
from tqdm import tqdm
import requests
import time


class Jockey:
    
    
    def __init__(self):
        
        
        # This Headers seems to allow access to more websites through python headers.
        self.headers = {
            'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
        }
        
        # Webpages that are the main access points for scraping
        self.jockeys_url = 'https://www.punters.com.au/stats/top-jockeys/'
        self.trainers_url = 'https://www.punters.com.au/stats/trainers/'
        
        # Headers in CSV are set in this list
        self.headings = ['Race','Jockey', 'Horse','Trainer', 'My Rating']
        
        # Checking of there is a CSV File already created if not one is created with headers
        # I have a formatted date to save as the filename to create unique copies.
        self.date_formatted_str = time.strftime('%Y_%m_%d_%H-%M', time.localtime())
        self.csv_filename = f"jockey_{self.date_formatted_str}.csv"
        
        
        # tally up total races for today
        #   dictonary for adding trainers to compare their values to other values
        self.races = 1
        self.trainer_rank = {}
        self.trainer_list = []
        
        self.sendlist = []
        
    
    def __repr__(self):
        return print('Jockey(), No arguments.')
        
                
        
    def top_50_trainers(self):
        
        ''' Grabbing the top 50 trainers 
            Adding the data to trainer rank dictionary to make a ranking system '''
         
        self.trainers_url = requests.get(self.trainers_url, headers=self.headers).text 
        trianer_soup = BeautifulSoup(self.trainers_url, 'html.parser')
        
        for trainer in tqdm(trianer_soup.findAll('a', class_="stats-table__link")):        
            trainers = trainer.text.split('.')  
            self.trainer_list.append(trainers) 
            self.trainer_rank[trainers[1].strip()] = int(trainers[0])
    
    
    def top_50_jockeys(self):
         
        '''Retrieve current top 50 jockeys from website, add those names into a dictonary
           There is a fair bit going on in this method. The main reason for that is the drilling down
           into multiple levels within each jockey to collect all the data needed '''
        
        dt = datetime.now(timezone.utc)
        utc_time = dt.replace(tzinfo=timezone.utc) 
        time_stored = utc_time.timestamp() 
             
           
        self.site = requests.get(self.jockeys_url, headers=self.headers).text
        # BeautifulSoup of html urls
        soup = BeautifulSoup(self.site, 'html.parser')
        
        for jockey in tqdm(soup.findAll('a', class_="stats-table__link")): 
             
            name = jockey.text
            name_num = name.split(".")
            
            # While proccessing the jockey names , retreive the link to the jockeys stats page
            # In the stats page retrieve the upcoming races.    
            next_site = f"https://www.punters.com.au{jockey['href']}"
            next_site = requests.get(next_site, headers=self.headers).text
        
            # Beautiful soup on html page retrieved from jockey's stat page
            soup2 = BeautifulSoup(next_site, 'html.parser')


            # Diving into the divs that contain information about upcoming races
            for race in soup2.findAll('div', class_="moduleItem zeb upcoming"):
                
                               
                # Parsing times of Jockeys next run
                today_find = race.find('abbr')
                date = int(today_find['data-utime'])
                              
                # Checking jockeys next run if it is today by comparing epoch times
                date_check = int(time.time()) + (43200 * 2)  # 24 hours of seconds added to scrapped time 
                 
                # Checking if the race is in the next 12 hours, if it is more information will 
                # be parsed and saved into CSV format
                if date <= date_check:
                    
                    # Silk link for a photo of silk
                    silk_link = race.find('div', class_="silk")
                    silk_link = silk_link.find('img')
                    silk_link = silk_link['src']
                    
                    # Parsing out the horses name
                    horse_find = race.findAll('a')
                    horse = horse_find[1].text
                
                    # parse out the Trainers name.
                    for t in race.findAll('span'):
                        trainer = t.text.replace(' trained by ', '').replace(',', '')
                        
                    # parse out the race location and race number   
                    for b in race.find('b'):
                        race = b.text    
                    
                    # Checking is in top 50 if not, it will default a value
                    if self.trainer_rank.get(trainer) is not None:
                        rank = int(self.trainer_rank[trainer])   
                        
                         
                        
                    else:
                        rank = ' > 50' 
                        continue
                    
                    # Horse rank arrangement
                    horse_rank = int(name_num[0]) 
                    try:
                        my_rank = rank + horse_rank
                    except TypeError:
                        my_rank = "50 + "
                                    
                                     
                    # A counter to count total races today (nothing important)
                    self.races += 1
                               
                               
                    self.sendlist.append([f"{race}, {name_num[0]} - {name_num[1]}, {horse}, {trainer} {rank}, {rank} - {trainer}, {silk_link}, {my_rank}, {time_stored}"])
                else:
                    pass


