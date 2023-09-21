const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)
const host = 'wss://broker.emqx.io:8084/mqtt'
const publishTopic = 'BAILE/input'
var ledIsOn = false
var msg = 'off'
const options = {
  keepalive: 60,
  clientId: clientId,
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  will: {
    topic: 'WillMsg',
    payload: 'Connection Closed abnormally..!',
    qos: 0,
    retain: false
  }
}
console.log('Connecting mqtt client')
const client = mqtt.connect(host, options)
client.on('error', err => {
  console.log('Connection error: ', err)
  client.end()
})
client.on('reconnect', () => {
  console.log('Reconnecting...')
})

client.on('connect', function () {
  console.log('Conectado ao servidor MQTT')
})



function move(cmd){
  client.publish(publishTopic, msg, { qos: 0, retain: false })
  console.log(cmd) 
}
/*const client = new Paho.MQTT.Client("wss://broker.emqx.io:8084/mqtt", "myClientId" + new Date().getTime());
const myTopic = "bailerobo/input";
client.connect({ onSuccess: onConnect })
let counter = 0;
function onConnect() {
  console.log("connection successful")
  client.subscribe(myTopic)   //subscribe to our topic
  setInterval(()=>{ publish(myTopic,`The count is now ${count++}`)},5000)
} //publish count every 5s

const publish = (topic, msg) => {  //takes topic and message string
  let message = new Paho.MQTT.Message(msg);
  message.destinationName = topic;
  client.send(message);
}

client.onMessageArrived = onMessageArrived;
function onMessageArrived(message) {
  let el= document.createElement('div')
  el.innerHTML = message.payloadString
  document.body.appendChild(el)
}

client.onConnectionLost = onConnectionLost;

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
  }
  client.connect({ onSuccess: onConnect });
}*/