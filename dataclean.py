import sqlite3
import time

def cleanData():
    '''
    This function calls the epoch time from the database it than compares to see if
    that time is older than 60 days.
    Data that is older than 60 days is deleted from the datbase.
    '''
    db_filename = 'weatherDB.db'

    total_seconds = 86400 * 60# seconds in a day

    while True:

        current_time = time.time()
        epoch_number = current_time - total_seconds

        conn = sqlite3.connect(db_filename)
        c = conn.cursor()

        c.execute(f'DELETE FROM weather WHERE epoch < {epoch_number}')
        conn.commit()
        c.close()
        
        print('Data checked and cleaned')

        time.sleep(3600)

