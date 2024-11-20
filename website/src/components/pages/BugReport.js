import React, { Component } from "react";
import {
  Container,
  Header
} from "semantic-ui-react";

import { styles as s } from "../../styles/styles"

class BugReport extends Component {

  render() {
    return (
      <Container text style={s.pageBody}>
        <div style={s.contentContainer}>
          <Header size="huge">Report a bug:</Header>
          <p>You found a bug? I'd love to hear about it!</p>
          <p>Please send an email to: contact@dominionkingdoms.net</p>
        </div>
      </Container>
    );
  }
}

export default BugReport;
