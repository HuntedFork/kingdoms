import React from "react";
import PropTypes from "prop-types";

import { staticAssetUrlCreator } from "../utility"
import { Image } from "semantic-ui-react";


class Card extends React.Component {

  static propTypes = {
    card: PropTypes.object,
    landscape: PropTypes.bool
  };

  state = {};

  render() {
    let src = staticAssetUrlCreator("/cards/")
    const { card, landscape, ...otherProps } = this.props;
    if (card) {
      src = src + card.image_name
    } else {
      const placeholder = landscape ? "dominion_back_landscape.jpg" : "dominion_back.jpg"
      src = src + placeholder
    }
    return (
      <Image src={src} {...otherProps}/>
    )
  }
}

export default Card;
