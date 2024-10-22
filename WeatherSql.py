from dotenv import load_dotenv
import datetime
import requests
import sqlite3
import json
import os


load_dotenv()


class WeatherStore:
    
    '''Connect to Weather API of My home Station and Store the Data
        into an sqlite3 db'''
    
    def __init__(self):
        
        self.db_filename = 'weatherDB.db'
        self.API_KEY = os.getenv('WEATHER_KEY')

        self.url = f'https://api.weather.com/v2/pws/observations/current?stationId=IMAITL74&format=json&units=m&apiKey={self.API_KEY}'
        self.history7day = f'https://api.weather.com/v2/pws/dailysummary/7day?stationId=IMAITL74&format=json&units=m&apiKey={self.API_KEY}'

        self.wu_data = None

        self.data_tracker = 0
        
        self.station_id = ''
        self.local_time = ''
        self.neighborhood = ''
        self.country = ''
        self.epoch = 0
        self.wind_direction = 0
        self.humidity = 0 
        self.temperature = 0
        self.wind_chill = 0
        self.heat_index = 0
        self.wind_speed = 0
        self.wind_gust = 0
        self.pressure = 0
        self.precip_rate = 0
        self.precip_total = 0
        self.elevation = 40
        
        

    def create_db(self):

        conn = sqlite3.connect(self.db_filename)
        c = conn.cursor()
        
        # Create a Weather table
        c.execute('''CREATE TABLE IF NOT EXISTS weather (
                    stationID TEXT, localTime TEXT, neighborhood TEXT, country TEXT,
                    epoch REAL, windDir INTEGER, humidity REAL, temp REAL,
                    windChill REAL, heatIndex REAL, windSpeed REAL, windGust REAL,
                    pressure REAL, precipRate REAL, precipTotal REAL, elevation INTEGER)''')
        conn.commit()

        c.close()
        
        


    def saveData(self):
        
        '''Store the variables into the db table
            the if statment checks if the epoch time has been set to avoid emtpy data being stored'''
            
        if self.epoch > self.data_tracker:
            
            conn = sqlite3.connect(self.db_filename)
            c = conn.cursor()
            
            c.execute("""INSERT INTO weather VALUES(
                        :stationID, :localTime, :neighborhood, :country, :epoch, :windDir, :humidity, :temp,
                        :windChill, :heatIndex, :windSpeed, :windGust, :pressure, :precipRate, :precipTotal, :elevation)""", 
                        {'stationID': self.station_id, 'localTime': self.local_time, 'neighborhood': self.neighborhood,
                        'country': self.country, 'epoch': self.epoch, 'windDir': self.wind_direction, 'humidity': self.humidity,
                        'temp': self.temperature, 'windChill': self.wind_chill, 'heatIndex': self.heat_index, 'windSpeed': self.wind_speed,
                        'windGust': self.wind_gust, 'pressure': self.pressure, 'precipRate': self.precip_rate, 
                        'precipTotal': self.precip_total, 'elevation': self.elevation})
            conn.commit()
            c.close()
            
            now = datetime.datetime.now()
            print(f"Time Stored sqlite--> {now.strftime('%Y-%m-%d_%H:%M:%S')}")
            
            self.data_tracker = self.epoch
            
        else:
            print('Failed to Save Data, epoch not greater than 1000')
        
    
    
    
    
    def callAPI(self):
        
        '''Retrive weather data and return data that has been trimmed'''

        wu = requests.get(self.url).text
        wu_data = json.loads(wu)
        self.wu_data = wu_data['observations'][0]

        ''' Set the Variables after calling API'''
        self.setVariables()    
        
        


    def setVariables(self):
        
        '''Called in callAPI function, this is all the variables to be stored into db'''
        
        self.station_id = self.wu_data['stationID']
        self.local_time = self.wu_data['obsTimeLocal']
        self.neighborhood = self.wu_data['neighborhood']
        self.country = self.wu_data['country']
        self.epoch = self.wu_data['epoch']
        self.wind_direction = self.wu_data['winddir']
        self.humidity = self.wu_data['humidity']

        self.temperature = self.wu_data['metric']['temp']
        self.wind_chill = self.wu_data['metric']['windChill']
        self.heat_index = self.wu_data['metric']['heatIndex']
        self.wind_speed = self.wu_data['metric']['windSpeed']
        self.wind_gust = self.wu_data['metric']['windGust']
        self.pressure = self.wu_data['metric']['pressure']
        self.precip_rate = self.wu_data['metric']['precipRate']
        self.precip_total = self.wu_data['metric']['precipTotal']
        self.elevation = self.wu_data['metric']['elev']


