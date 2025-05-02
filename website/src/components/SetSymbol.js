import React from "react";
import PropTypes from "prop-types";

import { staticAssetUrlCreator } from "../utility"
import { Image } from "semantic-ui-react";

class SetSymbol extends React.Component {

  static propTypes = {
    set: PropTypes.string,
    style: PropTypes.object
  };

  state = {};

  mapToImage = set => {
    switch (set) {
      case "Base":
        return "Dominion2.png"
      case "Base,2E":
        return "Dominion2.png"
      case "Base,1E":
        return "Dominion2.png"
      case "Intrigue":
        return "Intrigue2.png"
      case "Intrigue,1E":
        return "Intrigue1.png"
      case "Intrigue,2E":
        return "Intrigue2.png"
      case "Dark Ages":
        return "DarkAges.png"
      case "Hinterlands,1E":
        return "Hinterlands.png"
      case "Hinterlands,2E":
        return "Hinterlands.png"
      case "Prosperity,1E":
        return "Prosperity.png"
      case "Prosperity,2E":
        return "Prosperity.png"
      case "Seaside,1E":
        return "Seaside.png"
      case "Seaside,2E":
        return "Seaside.png"
      case "Cornucopia & Guilds":
        return "Cornucopia.png"
      case "Cornucopia & Guilds,1E":
        return "Cornucopia.png"
      case "Cornucopia & Guilds,2E":
        return "Cornucopia.png"
      case "Rising Sun":
        return "RisingSun.png"
      default:
        return set + ".png"
    }
  }

  render() {
    const src = staticAssetUrlCreator("/sets/" + this.mapToImage(this.props.set))
    const { set } = this.props;
    return (
      <Image title={set} alt={set} style={{height: 20, width: 20, ...this.props.style}} src={src}/>
    )
  }
}

export default SetSymbol;
