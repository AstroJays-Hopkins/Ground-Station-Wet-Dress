1. Install Python 3, node.js, and npm if not already: https://nodejs.org/en/, https://www.python.org/downloads/

2. In the command prompt navigate to the project folder: cd [path]

3. Navigate to flaskApp -> main, and open 'flaskAppPropulsionWetDress.py' in an editor.

4. If you are using data from a receiver, set 'Debug' to 'False'. If you are using locally generated random data, set it to 'True'.

5. If using a receiver, once it is plugged in, open Arduino. Otherwise go to step '6'.
	a. Go to Tools -> Port, and select the correct Arduino board.
	b. Open the Serial Monitor and verify that data is being received properly.
		b1. If not, try resetting the receiver.
	c. In flaskAppPropulsionWetDress.py, go to the 'ser' variable (line 25), and make sure the 'COMx' value matches that of the Arduino.

6. Enter 'python run.py'. Verify that you are receiving data (Lines of it should appear in the console).
	a. If you receive a 'x not installed' error. Then enter: 'pip install x' in the command prompt.
	b. If pip itself is not installed. Then you can get it here: https://pip.pypa.io/en/stable/installing/

7. Open a new command prompt and navigate to the project folder again.

8. Enter 'npm start'.
	8b. Navigate to 'localhost:3000' if it does not appear automatically.
