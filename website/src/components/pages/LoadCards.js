import React, { Component, useRef, useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { apiPost } from "../../actions/shared.js"
import { addError, addStatus } from "../../actions/redux/messages"


import {
  Button,
  Container,
  Loader,
} from "semantic-ui-react";

import CARDS from "../../cards.js"

import { styles as s } from "../../styles/styles.js"

class LoadCards extends Component {
  state = {
    isLoading: false,
    total: CARDS.length,
    index: 0,
    intervalRef: null
  }
  createCard(card) {
    const url = "/api/cards/"
    apiPost(url, card, ()=>{console.log('success')}, (error)=> {
      addError(error)
      console.log(error)}
    )
  }

  renderStatus(isRunning, done, total) {
    if (!isRunning) {
      return null;
    }
    return (
      <div>
        <Loader />
        <p>{done}/{total}</p>
      </div>
    )
  }

  render() {
    const cards = CARDS;
    const cardTimeoutDelayMillis = 100;

    const processNext = () => {
      if (this.state.index == this.state.total) {
        addStatus("Done!");
        this.state.isRunning = false;
        return
      }
      if (!this.state.isRunning) {
        addStatus('cancelled!');
        return;
      }
      this.createCard(cards[this.state.index]);
      this.state.index = this.state.index+1;
      window.setTimeout(processNext, cardTimeoutDelayMillis)
    }

    const startProcessing = (cards) => {
      this.state.index = 0;
      this.state.isRunning = true;
      processNext();
     }


    if (this.props.anonymous) {
      return (
      <Container style={s.pageBody}>
          <div>Must be logged in to see this page</div>
        </Container>
      )
    }
    return (
      <Container style={s.pageBody}>
        <p>Puts errors in console. Have it open!</p>
        <Button onClick={startProcessing}>Load All Cards</Button>
        <Button onClick={()=>{this.state.isRunning = false}}>Cancel</Button>
        {this.renderStatus(this.state.isRunning, this.state.index, cards.length)}

      </Container>
    )
  }
};

const mapStateToProps = state => {
  return {
    authenticated: state.auth.token !== null,
    anonymous: state.auth.anonymous,
    user: state.auth.username
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addError: (title, message) => dispatch(addError(title, message)),
    addStatus: (title, message) => dispatch(addStatus(title, message))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadCards);
