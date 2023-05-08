const { SerialPort, SerialPortMock } = require('serialport')
const Readline = require("@serialport/parser-readline");

const serialCom = () => {
  myPort = new SerialPort({
    path: "\\\\.\\COM3", baudRate: 9600, dataBits: 8, parity: 'none', stopBits: 1, flowControl: 0, autoOpen: false,
  })
  myPort.on('error', function(err) { console.log('Error: ', err.message); }) 
  myPort.on('close', function (err) {
    console.log('port closed', err);  
  });
  myPort.open(function (err) {
    if (err) {
      return console.log('Error opening port: ', err.message)
    }
  })

  myPort.write('red off')
}

module.exports = { serialCom };
