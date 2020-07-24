import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Container, Content, Text } from "native-base";
import init from "react_native_mqtt";
import { AsyncStorage } from "react-native";
//import { Thermometer } from "react-thermometer-chart";
//import GaugeChart from "react-gauge-chart";

import Config from "../config/config";

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  reconnect: true,
  sync: {},
});

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    const client = new Paho.MQTT.Client(
      Config.server,
      Config.port,
      "/ws",
      "web_" + parseInt(Math.random() * 100, 10)
    );
    client.onConnectionLost = this.onConnectionLost;
    client.onMessageArrived = this.onMessageArrived;

    const options = {
      useSSL: true,
      userName: Config.userName,
      password: Config.password,
      onSuccess: this.onConnect,
      onFailure: this.doFail,
    };

    this.state = {
      client,
      options,
      placa1State: true,
      placa2State: true,
      message_placa1: "",
      modalMessage: "",
      storeUser: "",
      weightArray: [],
      color: "red",
    };
  }

  /*Obtención de dispositivos para mostrar en la lista del Dashboard*/
  async componentDidMount() {
    await this.state.client.connect(this.state.options);
  }

  async componentWillUnmount() {
    await this.state.client.disconnect(this.state.options);
  }

  getUser = () => {
    alert(this.state.storeUser);
  };

  onConnect = () => {
    const { client } = this.state;
    console.log("onConnect");
    const topic = "/light";
    client.subscribe(topic);
  };

  onConnectionLost = (responseObject) => {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:" + responseObject.errorMessage);
    }
  };

  onMessageArrived = (message) => {
    if (message.destinationName == "/light") {
      console.log("Placa 1:" + message.payloadString);
      this.setState({ message_placa1: message.payloadString });
    }
  };

  doFail = (e) => {
    console.log("error", e);
  };

  renderWeight = (id) => {
    if (id == "/light") {
      return this.state.message_placa1;
    }
  };

  check = (id) => {
    if (id == "/light") {
      return this.state.placa1State;
    }
  };

  setStateWeight = (id) => {
    if (id == "placa1") {
      if (this.state.placa1State) {
        this.setState({ placa1State: false });
      } else {
        this.setState({ placa1State: true });
      }
    }
  };

  render() {
    return <Pass isLoggedIn={this.state.message_placa1} />;
  }
}

function Pass(props) {
  const Temperature = props.isLoggedIn;
  if (Temperature <= 37) {
    return (
      <Container>
        <Content
          contentContainerStyle={styles.content}
          style={{ backgroundColor: "green" }}
        >
          <Text style={styles.textCenter}>{Temperature}°C</Text>
        </Content>
      </Container>
    );
  }
  return (
    <Container>
      <Content
        contentContainerStyle={styles.content}
        style={{ backgroundColor: "red" }}
      >
        <Text style={styles.textCenter}>{Temperature}°C</Text>
      </Content>
    </Container>
  );
}

const styles = StyleSheet.create({
  textCenter: {
    fontSize: 60,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "green",
  },
  loadingApp: {
    textAlign: "center",
    width: "100%",
    justifyContent: "center",
  },
  button: {
    marginLeft: "38%",
  },
  container: {
    backgroundColor: "white",
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 15,
  },
  itemValue: {
    color: "gray",
    fontSize: 15,
    position: "absolute",
    right: 15,
    alignSelf: "flex-end",
  },
  keyboard: {
    flex: 1,
  },
  View: {
    flex: 1,
    flexDirection: "row",
  },
});
