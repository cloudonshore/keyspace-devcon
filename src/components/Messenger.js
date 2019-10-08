import React from "react";
import { Heading, Text, TextInput, Button } from "grommet";
import Broadcaster from "../lib/broadcaster";

// window.setInterval(() => {
//   debugger;
//   broadcaster.sendMessage("hello ya");
// }, 1000);

class Messenger extends React.Component {
  state = {
    messages: [],
    newMessage: `test ${Math.random()}`
  };
  componentDidMount() {
    this.broadcaster = new Broadcaster(msg => {
      this.setState({ messages: [...this.state.messages, msg] });
    });
  }
  sendMessage() {
    this.broadcaster.sendMessage(this.state.newMessage);
    this.setState({ newMessage: "" });
  }
  render() {
    const { messages, newMessage } = this.state;
    return (
      <div className="App">
        <TextInput
          placeholder="type here"
          value={newMessage}
          onChange={event =>
            this.setState({
              newMessage: event.target.value
            })
          }
        />
        {messages.map((message, i) => (
          <Text key={`${message}${i}`}>{message}</Text>
        ))}

        <Button
          label="Send Message"
          onClick={() => {
            this.sendMessage();
          }}
        />
      </div>
    );
  }
}

export default Messenger;
