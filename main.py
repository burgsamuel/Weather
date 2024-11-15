from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from WeatherSql import WeatherStore
from dataclean import cleanData
from fastapi.params import Body
import threading
import sqlite3
import time



##############################################
#       Set Up Instances and Varaibles       #
##############################################

# Database file name
db_filename = 'weatherDB.db'

horse_data_list = []
   
with open("horse_data.txt", 'w') as f:
    f.write('')
    
weather = WeatherStore()
weather.create_db()
# Set up function for worker thread to call
def callApi():
    '''This function is to time the calling to the weather
        api and saving of the data.'''
    while True:
        weather.callAPI()
        weather.saveData()
        time.sleep(600)



##############################################
#          Start some worker threads         #
##############################################


thread_one = threading.Thread(target=callApi, daemon=True).start() # calling api and updating every 10 min
thread_two = threading.Thread(target=cleanData, daemon=True).start() # running the dabtabase delete function


##############################################
#          Start fast api server             #
##############################################


app = FastAPI()

app.mount("/static", StaticFiles(directory = "static", html = True), name = "static")
app.mount("/horsetoday", StaticFiles(directory = "horse", html = True), name = "horse")


@app.get("/weather")
async def weather_data():
    data = main_page_weather()
    return data


@app.get('/tempChart')
async def tempChartData():
    data = tempChart(350)
    return data


@app.get('/pressureChart')
async def pressureChartData():
    data = pressureChart(350)
    return data


@app.post('/recieve_horse')
async def horse_data(data: dict = Body (...)):
    horse_data_list.clear()
    horse_data_list.append(data['data']) 
    return { "recieved" : data }


@app.get("/horsedata")
async def horsedata():
    data = await horse_data_list    
    return data



##############################################
#      Define All Funcitons for server       #
##############################################


def main_page_weather():
    '''
    Data for all the main display fields
    '''
    conn = sqlite3.connect(db_filename)
    c = conn.cursor()
    c.execute('SELECT * FROM weather ORDER BY epoch DESC')
    data = c.fetchone()
    c.close()
    return data



def tempChart(number):
    '''
    Retrieve all the temp chart data
    '''
    conn = sqlite3.connect(db_filename)
    c = conn.cursor()
    c.execute(f'SELECT localTime, temp FROM weather ORDER BY epoch DESC limit {number}')
    data = c.fetchall()
    c.close()
    return data



def pressureChart(number):
    '''
    retrieve all the pressure chart data
    '''
    conn = sqlite3.connect(db_filename)
    c = conn.cursor()
    c.execute(f'SELECT localTime, pressure FROM weather ORDER BY epoch DESC limit {number}')
    data = c.fetchall()
    c.close()
    return data


