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
        <Header size="huge">Support The Site:</Header>
        <Header size="large">Who am I?</Header>
        <p>Hi! I'm a small creator who dabbles in making website sometimes. I love dominion, and especially like playing with curated sets that let you do fun things.</p>
        <Header size="large">Why should I support you?</Header>
          <p>Running the website isn't free. Unfortunately there are database and webserver costs I have to pay to keep it afloat. Right now I have ads up to help out, but I'd love to take those down at some point. Additionally, I'd love to add some features but it can be hard to justify the time commitment. If you love the site and want to see more of it I'd love it if you:</p>
          <div dangerouslySetInnerHTML={{
            __html: '<a href="https://www.buymeacoffee.com/kelpycreekw" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" /></a>'
          }} />
        </div>
      </Container>
    );
  }
}

export default BugReport;
