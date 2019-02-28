from flask import Flask
from flaskext.mysql import MySQL
from flask_cors import CORS, cross_origin
from flaskApp.main.flaskAppWetDress import flaskAppWetDress

db = MySQL()

def create_app(offline=True):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    cors = CORS(app, resources={r'/*': {"origins": '*'}})
    app.config['CORS_HEADERS'] = 'Content-Type'
	


    db.init_app(app)

    app.register_blueprint(flaskAppWetDress, url_prefix='/')

    return app
