import psycopg2
import json
import flask
from flask import request
from itertools import chain
import databaseconfig
from flask_cors import CORS
import jsonify
import coviddata

app = flask.Flask(__name__)
app.config["DEBUG"] = True
cors = CORS(app)

@app.route('/getHospitals', methods=['GET'])
def getHospitals():
    conn = psycopg2.connect(
        database = databaseconfig.database, 
        user = databaseconfig.user, 
        password = databaseconfig.password, 
        host = databaseconfig.host, 
        port = databaseconfig.port
    )
    cursor = conn.cursor()
    cursor.execute("select version()")
    data = cursor.fetchone()
    print("Connection established to: ",data)
    cursor = conn.cursor()

    cursor.execute('''SELECT row_to_json(hospitals) from hospitals''')
    result = cursor.fetchall()
    result = list(chain.from_iterable(result))

    # return str(result)
    return json.dumps({"data":result})


@app.route('/getHospitalById', methods=['GET'])
def getHospitalById():
    conn = psycopg2.connect(
        database = databaseconfig.database, 
        user = databaseconfig.user, 
        password = databaseconfig.password, 
        host = databaseconfig.host, 
        port = databaseconfig.port
    )
    cursor = conn.cursor()
    cursor.execute("select version()")
    data = cursor.fetchone()
    print("Connection established to: ",data)
    cursor = conn.cursor()
    
    hospitalid = request.args['hospitalid']

    cursor.execute('''SELECT row_to_json(hospitals) from hospitals where hospitalid='''+ hospitalid +''' ''')
    result = cursor.fetchall()
    result = list(chain.from_iterable(result))

    # return str(result)
    return json.dumps({"data":result})


@app.route('/getStates', methods=['GET'])
def getState():
    conn = psycopg2.connect(
        database = databaseconfig.database, 
        user = databaseconfig.user, 
        password = databaseconfig.password, 
        host = databaseconfig.host, 
        port = databaseconfig.port
    )
    cursor = conn.cursor()
    cursor.execute("select version()")
    data = cursor.fetchone()
    print("Connection established to: ",data)
    cursor = conn.cursor()

    cursor.execute('''SELECT row_to_json(states) from states''')
    result = cursor.fetchall()
    result = list(chain.from_iterable(result))

    # return str(result)
    return json.dumps({"data":result})


@app.route('/getDistricts', methods=['GET'])
def getDistricts():
    conn = psycopg2.connect(
        database = databaseconfig.database, 
        user = databaseconfig.user, 
        password = databaseconfig.password, 
        host = databaseconfig.host, 
        port = databaseconfig.port
    )
    cursor = conn.cursor()
    cursor.execute("select version()")
    data = cursor.fetchone()
    print("Connection established to: ",data)
    cursor = conn.cursor()

    stateid = request.args['stateid']

    cursor.execute('''SELECT row_to_json(districts) from districts where stateid='''+ stateid +''' ''')
    result = cursor.fetchall()
    result = list(chain.from_iterable(result))

    # return str(result)
    return json.dumps({"data":result})


@app.route('/getCities', methods=['GET'])
def getCities():
    conn = psycopg2.connect(
        database = databaseconfig.database, 
        user = databaseconfig.user, 
        password = databaseconfig.password, 
        host = databaseconfig.host, 
        port = databaseconfig.port
    )
    cursor = conn.cursor()
    cursor.execute("select version()")
    data = cursor.fetchone()
    print("Connection established to: ",data)
    cursor = conn.cursor()

    districtid = request.args['districtid']

    cursor.execute('''SELECT row_to_json(cities) from cities where districtid='''+ districtid +''' ''')
    result = cursor.fetchall()
    result = list(chain.from_iterable(result))

    # return str(result)
    return json.dumps({"data":result})


@app.route('/getHospitalByState', methods=['GET'])
def getHospitalByState():
    conn = psycopg2.connect(
        database = databaseconfig.database, 
        user = databaseconfig.user, 
        password = databaseconfig.password, 
        host = databaseconfig.host, 
        port = databaseconfig.port
    )
    cursor = conn.cursor()
    cursor.execute("select version()")
    data = cursor.fetchone()
    print("Connection established to: ",data)
    cursor = conn.cursor()
    
    hospitalstate = '\'' + request.args['hospitalstate'] + '\''

    cursor.execute('''SELECT row_to_json(hospitals) from hospitals where hospitalstate='''+ hospitalstate +''' ''')
    result = cursor.fetchall()
    result = list(chain.from_iterable(result))

    # return str(result)
    return json.dumps({"data":result})


@app.route('/getHospitalByDistrict', methods=['GET'])
def getHospitalByDistrict():
    conn = psycopg2.connect(
        database = databaseconfig.database, 
        user = databaseconfig.user, 
        password = databaseconfig.password, 
        host = databaseconfig.host, 
        port = databaseconfig.port
    )
    cursor = conn.cursor()
    cursor.execute("select version()")
    data = cursor.fetchone()
    print("Connection established to: ",data)
    cursor = conn.cursor()
    
    hospitaldistrict = '\'' + request.args['hospitaldistrict'] + '\''

    cursor.execute('''SELECT row_to_json(hospitals) from hospitals where hospitaldistrict='''+ hospitaldistrict +''' ''')
    result = cursor.fetchall()
    result = list(chain.from_iterable(result))

    # return str(result)
    return json.dumps({"data":result})


@app.route('/getHospitalByCity', methods=['GET'])
def getHospitalByCity():
    conn = psycopg2.connect(
        database = databaseconfig.database, 
        user = databaseconfig.user, 
        password = databaseconfig.password, 
        host = databaseconfig.host, 
        port = databaseconfig.port
    )
    cursor = conn.cursor()
    cursor.execute("select version()")
    data = cursor.fetchone()
    print("Connection established to: ",data)
    cursor = conn.cursor()
    
    hospitalcity = '\'' + request.args['hospitalcity'] + '\''

    cursor.execute('''SELECT row_to_json(hospitals) from hospitals where hospitalcity='''+ hospitalcity +''' ''')
    result = cursor.fetchall()
    result = list(chain.from_iterable(result))

    # return str(result)
    return json.dumps({"data":result})

@app.route('/getStateWiseCovidData', methods=['GET'])
def getStateWiseCovidData():
    
    state = request.args['state']
    data = coviddata.statewisedata(state)
   
    return data

@app.route('/getDistrictWiseCovidData', methods=['GET'])
def getDistrictWiseCovidData():
    
    state = request.args['state']
    district = request.args['district']
    data = coviddata.districtwisedata(state, district)
   
    return data

@app.route('/getBedsDetails', methods=['GET'])
def getBedsDetails():
    conn = psycopg2.connect(
        database = databaseconfig.database, 
        user = databaseconfig.user, 
        password = databaseconfig.password, 
        host = databaseconfig.host, 
        port = databaseconfig.port
    )
    cursor = conn.cursor()
    cursor.execute("select version()")
    data = cursor.fetchone()
    print("Connection established to: ",data)

    cursor = conn.cursor()
    filterby = str(request.args['filterby'])
    value = '\'' + request.args['value'] + '\''

    cursor.execute('''SELECT (SUM(bedsavailable)) as TotalBedsVacant, (SUM(hospitalcapacity)-SUM(bedsavailable)) as TotalBedsOccupied 
	FROM public.hospitals
	WHERE hospital''' + filterby + '''='''+ value +''' ''')
    result = cursor.fetchall()
    result = list(chain.from_iterable(result))
    
    finalresponse = {"BedsVacant": str(result[0]), "BedsOccupied": str(result[1])}
    
    return finalresponse


@app.route('/getAllSurvivors', methods=['GET'])
def getAllSurvivors():
    conn = psycopg2.connect(
        database = databaseconfig.database, 
        user = databaseconfig.user, 
        password = databaseconfig.password, 
        host = databaseconfig.host, 
        port = databaseconfig.port
    )
    cursor = conn.cursor()
    cursor.execute("select version()")
    data = cursor.fetchone()
    print("Connection established to: ",data)
    cursor = conn.cursor()

    cursor.execute('''SELECT row_to_json(survivors) from survivors''')
    result = cursor.fetchall()
    result = list(chain.from_iterable(result))

    # return str(result)
    return json.dumps({"data":result})

@app.route('/getSurvivorById', methods=['GET'])
def getSurvivorById():
    conn = psycopg2.connect(
        database = databaseconfig.database, 
        user = databaseconfig.user, 
        password = databaseconfig.password, 
        host = databaseconfig.host, 
        port = databaseconfig.port
    )
    cursor = conn.cursor()
    cursor.execute("select version()")
    data = cursor.fetchone()
    print("Connection established to: ",data)
    cursor = conn.cursor()

    survivorid = request.args['survivorid']

    cursor.execute('''SELECT row_to_json(survivors) from survivors where survivorid='''+ survivorid +''' ''')
    result = cursor.fetchall()
    result = list(chain.from_iterable(result))

    # return str(result)
    return json.dumps({"data":result})

app.run()