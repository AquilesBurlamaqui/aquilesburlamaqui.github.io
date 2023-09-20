const client = new Paho.MQTT.Client("wss://mqtt.eclipse.org", "myClientId" + new Date().getTime());
const myTopic = "bailemqtt";
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
}