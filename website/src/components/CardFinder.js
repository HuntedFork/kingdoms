import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Dropdown } from "semantic-ui-react";
import CARDS from "../cards.js"

class CardFinder extends React.Component {
  static propTypes = {
    onSelect: PropTypes.func,
    landscape: PropTypes.bool,
    focusRef: PropTypes.func,
    multiple: PropTypes.bool
  };

  state = {
    options: [],
    value: '',
  };

  timeoutRef = null;

  generateOptions = () => {
    const landscape = !!this.props.landscape
    const cards = CARDS.filter(
      card => card.supply && landscape === card.landscape
    )
    return cards.map(card => {
      return {
        key: card.name,
        value: card.name,
        text: card.name
      }
    })
  }

  handleOpen = () => {
    if (this.state.options.length < 1) {
      this.setState({options: this.generateOptions()})
    }
  }

  handleResultSelect = (e, data) => {
    const selection = data.value
    this.props.onSelect(CARDS.find(card=>card.name===selection))
  }

  render() {
    return (
      <Dropdown
        size={this.props.multiple ? "" : "mini"}
        search
        selection
        lazyLoad
        multiple={this.props.multiple}
        selectOnBlur={false}
        upward={false}
        selectOnNavigation={false}
        options={this.state.options}
        onOpen={this.handleOpen}
        onChange={this.handleResultSelect}
        searchInput={{ autoFocus: true }}
      />
    );
  }
}


const mapStateToProps = state => {
  return { };
};

const mapDispatchToProps = dispatch => {
  return { };
}

export default connect(mapStateToProps, mapDispatchToProps)(CardFinder);
