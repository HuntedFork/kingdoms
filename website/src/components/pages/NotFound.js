import React, { Component } from "react";
import {
  Container,
  Header
} from "semantic-ui-react";

import { styles as s } from "../../styles/styles"


class NotFound extends Component {

  render() {
    return (
      <Container style={s.pageBody} text>
        <div style={s.contentContainer}>
          <Header size="huge">Not found</Header>
          <p>Oh no! The dreaded "Not Found." Unfortunately we can't find the page you're looking for.</p>
        </div>
      </Container>
    );
  }
}

export default NotFound;
