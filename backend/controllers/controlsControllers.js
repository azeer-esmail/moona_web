
const asyncHandler = require("express-async-handler");
const { SerialPort } = require('serialport')

const serialCom = () => {
  plcPort = new SerialPort({
    path: "\\\\.\\COM3",
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: 0,
    autoOpen: false,
  })
  plcPort.on('error', function(err) { console.log('Error: ', err.message); }) 
  plcPort.on('close', function (err) { console.log('port closed', err); });
  plcPort.open(function (err) {
    if (err) {
      return console.log('Error opening port: ', err.message)
    }
  })

  return plcPort
}

const accessControls = asyncHandler(async (req, res) => {
    try {
      res.status(200)
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
});

module.exports = { accessControls, serialCom };
