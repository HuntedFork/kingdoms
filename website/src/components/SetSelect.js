import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Segment, Checkbox, Button } from "semantic-ui-react";

import { styles as s } from "../styles/styles.js"
import SETS from "../sets.js"


class SetSelect extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    selected: PropTypes.array
  };

  state = {};

  select = sets => {
    localStorage.setItem('userSets', JSON.stringify(sets))
    this.props.onChange(sets)
  }

  toggle = set => {
    if (this.props.selected.includes(set)) {
      this.select(this.props.selected.filter(x => x!==set))
    } else {
      this.select([set, ...this.props.selected])
    }
  }

  handleSelectAll = () => this.select(SETS)

  handleSelectNone = () => this.select([])

  renderCheckbox = set => {
    return (
      <span key={set}>
        <Checkbox
          label={set}
          onChange={()=>this.toggle(set)}
          checked={this.props.selected.includes(set)}
        />
        <br />
      </span>
    )
  }

  render() {
    return (
      <Segment compact>
        {SETS.map(set => this.renderCheckbox(set))}
        <Button.Group>
          <Button positive onClick={this.handleSelectAll}>All</Button>
          <Button.Or />
          <Button negative onClick={this.handleSelectNone}>None</Button>
        </Button.Group>
      </Segment>
    );
  }
}


const mapStateToProps = state => {
  return {  };
};

const mapDispatchToProps = dispatch => {
  return { };
}

export default connect(mapStateToProps, mapDispatchToProps)(SetSelect);
