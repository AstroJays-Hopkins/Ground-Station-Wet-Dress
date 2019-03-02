long randNumber;


void setup() {
  Serial.begin(9600);

  // if analog input pin 0 is unconnected, random analog
  // noise will cause the call to randomSeed() to generate
  // different seed numbers each time the sketch runs.
  // randomSeed() will then shuffle the random function.
  randomSeed(analogRead(0));
}

void loop() {
  int randArray[6] = {random(100), random(100), random(14, 1000), random(14, 1000), random(0,2), random(0,2)}; 

  String test = String(random(100)) + ' ' + String(random(100)) + ' ' +  String(random(14, 1000)) + ' ' + String(random(14, 1000)) + ' ' + String(random(0,2)) + ' ' + String(random(0,2));
  Serial.println(test);

  delay(50);
}
