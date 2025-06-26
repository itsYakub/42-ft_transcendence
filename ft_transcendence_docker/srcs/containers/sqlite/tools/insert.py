import sqlite3

# Connecting to sqlite
conn = sqlite3.connect('transcendence.db')

# Creating a cursor object using the 
# cursor() method
cursor = conn.cursor()

# Queries to INSERT records.
#cursor.execute("INSERT INTO LANGUAGES (7, 'test')")
cursor.execute("CREATE TABLE lang(name, first_appeared)")

# Commit your changes in the database    
conn.commit()

# Closing the connection
conn.close()
