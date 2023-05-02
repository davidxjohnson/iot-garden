/*********
  Rui Santos
  Complete project details at https://randomnerdtutorials.com  
*********/

// Motor A
int motor1Pin1 = 27; 
int motor1Pin2 = 26; 
int enable1Pin = 14; 

// Setting PWM properties
const int freq = 30000;
const int pwmChannel = 0;
const int resolution = 8;
int dutyCycle = 200;

void setup() {
  // sets the pins as outputs:
  pinMode(motor1Pin1, OUTPUT);
  pinMode(motor1Pin2, OUTPUT);
  pinMode(enable1Pin, OUTPUT);
  
  // configure LED PWM functionalitites
  ledcSetup(pwmChannel, freq, resolution);
  
  // attach the channel to the GPIO to be controlled
  ledcAttachPin(enable1Pin, pwmChannel);
  ledcWrite(pwmChannel, 200);   

  Serial.begin(115200);

  // testing
  Serial.print("Testing DC Motor...");
}

void loop() {
  // Move DC motor backwards at maximum speed
  ledcWrite(pwmChannel, 255);   
  Serial.println("Moving to start position ...");
  digitalWrite(motor1Pin1, LOW);
  digitalWrite(motor1Pin2, HIGH);
  delay(8000);

  // Move DC motor forward with increasing speed
  Serial.print("Forward with duty cycle: ");
  Serial.println(160);
  digitalWrite(motor1Pin1, HIGH);
  digitalWrite(motor1Pin2, LOW);
  ledcWrite(pwmChannel, 160);   
  delay(10000);
  Serial.print("Forward with duty cycle: ");
  Serial.println(200);
  ledcWrite(pwmChannel, 200);   
  delay(5000);
  Serial.print("Forward with duty cycle: ");
  Serial.println(255);
  ledcWrite(pwmChannel, 255);   
  delay(2500);
//  while (dutyCycle <= 255){
//    ledcWrite(pwmChannel, dutyCycle);   
//    Serial.print("Forward with duty cycle: ");
//    Serial.println(dutyCycle);
//    dutyCycle = dutyCycle + 10;
//    delay(1000);
//  }
  // Stop the DC motor
  Serial.println("Motor stopped");
  digitalWrite(motor1Pin1, LOW);
  digitalWrite(motor1Pin2, LOW);
  delay(1000);*/
}
