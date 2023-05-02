/*
 * David X Johnson
 * ESP32 sketch for a temperature driven linear actuator
 * that opens/closes a vent to maintain temperature for
 * a home garden or greenhouse.
 * 
 * Uses:
 *   - DS18B20 (thermometer) 
 *   - L298N (H-Bridge, motor control)
 */
 
#include <OneWire.h>
#include <DallasTemperature.h>

/* Asign a GPIO pin for the DS18B20, setup a oneWire instance 
 *  to communicate with device and use as a reference for 
 *  Dallas Temperature sensor library.
*/ 

// globals
const int oneWireBus = 4;     
OneWire oneWire(oneWireBus);
DallasTemperature sensors(&oneWire);

// moisture sensor
const int SensorPin = A0;
int soilMoistureValue = 0;
int soilmoisturepercent=0;
const int AirValue = 790;   //you need to replace this value with Value_1
const int WaterValue = 390;  //you need to replace this value with Value_2

// Setting PWM properties
// Motor A properties
int motor1Pin1 = 27; 
int motor1Pin2 = 26; 
int enable1Pin = 14; 
const int freq = 30000;
const int pwmChannel = 0;
const int resolution = 8;
int dutyCycle = 200;
int dutyDuration=2000;

// temperate control properties
char tempScale = 'F'; // choices are C or F
float highTemp = 90;
float lowTemp = 80;
float currentTemp=70;
char tempStatus[100];
int pollDelay = 5000; // milliseconds;

// configure the libraries and pins
void setup(void) {
  // Start the Serial Monitor
  Serial.begin(115200);
  sensors.begin(); // Start the DS18B20 sensor
  Serial.printf("%d OneWire devices found.\n", sensors.getDeviceCount());

  // report parasite power requirements
  Serial.printf("Parasite power mode is: %s\n", sensors.isParasitePowerMode() ? "ON": "OFF");

  // sets the pins as outputs for PWM
  pinMode(motor1Pin1, OUTPUT);
  pinMode(motor1Pin2, OUTPUT);
  pinMode(enable1Pin, OUTPUT);

  // configure LED PWM functionalitites
  ledcSetup(pwmChannel, freq, resolution);
  // attach the channel to the GPIO to be controlled
  ledcAttachPin(enable1Pin, pwmChannel);

}

void loop(void) {
  soilMoistureValue = analogRead(SensorPin);  //put Sensor insert into soil
  soilmoisturepercent = ( 100 - ( (soilMoistureValue/4095.00) * 100 ) );
  Serial.printf("Soil moisture is %i\%%\n", soilmoisturepercent);
  sensors.requestTemperatures();
  if( tempScale == 'F' ) {
    currentTemp = sensors.getTempFByIndex(0);
  } else {
    currentTemp = sensors.getTempCByIndex(0);
  }

  if( currentTemp > highTemp ) {
    sprintf(tempStatus, "is above the high limit of %5.2fº%c.", highTemp, tempScale);
    openVent(dutyDuration,dutyCycle); // medium speed for 1 second
  } else if (currentTemp < lowTemp) {
    sprintf(tempStatus, "is below the low limit of %5.2fº%c.",lowTemp, tempScale);
    closeVent(dutyDuration,dutyCycle); // medium speed for 1 second
  } else {
    sprintf(tempStatus, "is in the desired range of %5.2f%c and %5.2fº%c.", lowTemp, tempScale, highTemp, tempScale);
  }
  Serial.printf("%5.2fº%c %s\n", currentTemp, tempScale, tempStatus);
  delay(15000);
}

void openVent(int _speed, int _duration) {
  digitalWrite(motor1Pin1, HIGH);
  digitalWrite(motor1Pin2, LOW);
  ledcWrite(pwmChannel, _speed);   
  delay(_duration);
  digitalWrite(motor1Pin1, LOW);
  digitalWrite(motor1Pin2, LOW);
}

void closeVent(int _speed, int _duration) {
  digitalWrite(motor1Pin1, LOW);
  digitalWrite(motor1Pin2, HIGH);
  ledcWrite(pwmChannel, _speed);   
  delay(_duration);
  digitalWrite(motor1Pin1, LOW);
  digitalWrite(motor1Pin2, LOW);
}
