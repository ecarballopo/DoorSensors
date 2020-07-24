import init from "react_native_mqtt";
import { AsyncStorage } from "react-native";

export default function MQTTClient() {
  init({
    size: 10000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    reconnect: true,
    sync: {},
  });

  function onConnect() {
    console.log("onConnect");

    const topic = "/light";
    client.subscribe(topic);
    message = new Paho.MQTT.Message("Connected");
    message.destinationName = topic;
    client.send(message);
  }

  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:" + responseObject.errorMessage);
    }
  }

  function onMessageArrived(message) {
    console.log("onMessageArrived:" + message.payloadString);
  }

  function doFail(e) {
    console.log("error", e);
  }

  const client = new Paho.MQTT.Client(
    "soldier.cloudmqtt.com",
    33115,
    "web_" + parseInt(Math.random() * 100, 10)
  );
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;

  const options = {
    useSSL: true,
    userName: "mfoubemo",
    password: "9oUEiStFQCHU",
    onSuccess: onConnect,
    onFailure: doFail,
  };

  client.connect(options);

  return client;
}
