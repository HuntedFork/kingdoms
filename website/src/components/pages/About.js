import React, { Component } from "react";
import {
  Container,
  Header
} from "semantic-ui-react";

import { styles as s } from "../../styles/styles"

class About extends Component {

  render() {
    return (
      <Container text style={s.pageBody}>
        <div style={s.contentContainer}>
          <Header size="huge">About</Header>
            <Header size="large">What's dominion?</Header>
            <p>
              Dominion is a board game made by Donald X. Vaccarino and published by Rio Grande Games. This site has no official affiliation with either party,
              and takes its images and info from the wonderful <a href="http://wiki.dominionstrategy.com">Dominion Strategy Wiki</a>.
            </p>
            <p>
              If you haven't played dominion before, it's a really really good game and you totally should.
            </p>
          <Header size="large">What's a kingdom?</Header>
          <p>
            In the board game dominion you choose 10 piles of cards to be in the center and form the supply.
            Those cards, along with options like whether or not to use colonies/platinum (from prosperity) or shelters (from dark ages) make up a kingdom.
          </p>
          <p>
            Most dominion players play with either the recommended kingdoms that come with each expansion, or by randomly making their own.
            But some design their own kingdoms. This website is for people to save their favorite kingdoms, either to share and discuss with friends
            or to save to replay again later.
          </p>
          <Header size="large">What's this website for?</Header>
          <p>
            This website is for creating your own kingdoms, sharing kingdoms with others, and keeping track of the kingdoms you've played through ratings.
          </p>
          <Header size="large">I thought of a cool thing you should do!</Header>
          <p>
            I'd love to hear your feature request! Email me at contact@dominionkingdoms.net
          </p>
        </div>
      </Container>
    );
  }
}

export default About;
