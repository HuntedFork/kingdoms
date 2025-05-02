import React from "react";
import { connect } from "react-redux";
import { Message } from "semantic-ui-react";

import { dismissMessage } from "../actions/redux/messages";
import '../styles/Kingdom.css';


class Messages extends React.Component {

  state = {};

  componentDidMount() {
    this.autoDismissMessages()
  }

  autoDismissMessages = () => {
    this.props.messages.map(message => {
      if (message.type === 'status' && message.time + 3000 < Date.now()) {
        this.handleDismiss(message)
      }
      return false; //makes console warning go away
    })
    setTimeout(this.autoDismissMessages, 3000);
  }

  handleDismiss = message => {
    this.props.dismiss(message.id)
  }

  renderMessage = message => {
    return (
      <Message
        key={message.time}
        floating
        header={message.title}
        content={message.content}
        error={message.type === "error"}
        onDismiss={() => this.handleDismiss(message)}
      />
    )
  }

  render() {
    return (
      <div style={{position: "fixed", top: "5em", zIndex:1, margin: "auto", left:10, right:10}}>
        {this.props.messages.map(message => this.renderMessage(message))}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    messages: state.messages.messages
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dismiss: id => dispatch(dismissMessage(id))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Messages);
