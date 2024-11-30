from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.params import Body





##############################################
#       Set Up Instances and Varaibles       #
##############################################


horse_data_list = []
results_data_list = []
horse_odds_list = []
   

##############################################
#          Start fast api server             #
##############################################


app = FastAPI()


app.mount("/horsetodayv2", StaticFiles(directory = "horseV1.1", html = True), name = "horseV1.1")



@app.post('/recieve_horse')
async def horse_data(data: dict = Body (...)):
    horse_data_list.clear()
    horse_data_list.append(data['data']) 
    return { "recieved" : data }


@app.get("/horsedata")
def horsedata():
    data = horse_data_list    
    return data


@app.get("/horsetoday")
def horse():   
    return {"Page is now" : "Shut Down",
            "MMMMMMM" : "KFC"}