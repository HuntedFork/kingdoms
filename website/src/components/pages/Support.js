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
        <p>Running DominionKingdoms isn't free! I'm currently paying out of pocket for database and webserver costs to keep the site afloat, but those costs will increase as the site grows.</p>
        <p>To help with costs, I currently have ads running on the site, but I would love to be able to remove them in the future if the site becomes more user-supported.</p>
        <p>In addition to keeping the lights on, I'd love to add some features if the basic financial needs of the site are already taken care of, but I need to see that people love it  </p>
          <div dangerouslySetInnerHTML={{
            __html: '<a href="https://www.buymeacoffee.com/kelpycreekw" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" /></a>'
          }} />
        </div>
      </Container>
    );
  }
}

export default BugReport;
