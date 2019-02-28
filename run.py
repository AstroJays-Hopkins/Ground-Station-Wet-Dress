from flaskApp import create_app
from flaskApp.main.flaskAppWetDress import home as home
from threading import Thread

app = create_app(offline=True)


if __name__ == '__main__':
	t1 = Thread(target=home)
	t1.daemon = True
	t1.start()
	app.run(debug=False)
