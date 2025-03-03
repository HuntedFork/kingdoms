import React from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";
import { Segment, Label, Grid, Header, Button, Rating } from "semantic-ui-react";
import SetSymbol from "./SetSymbol"
import Supply from "./Supply"

import { styles as s } from "../styles/styles"

class KingdomSummary extends React.Component {

  static propTypes = {
    kingdom: PropTypes.object
  };

  state = {
    expanded: false
  };

  toggleExpansion = () => {
    this.setState({expanded: !this.state.expanded})
  }
  renderRating = () => {
    if (!this.props.kingdom.rating) return null
    return (
      <span>
        {'My Rating:'}
        <Rating
          icon="star"
          disabled
          rating={this.props.kingdom.rating}
          maxRating={5}
        />
      </span>
    )
  }

  renderTitle = () => {
    const link = "/kingdom/" + this.props.kingdom.pk
    return (
      <div>
        <Header
          style={{
            overflow:"hidden",
            textOverflow:"ellipsis"
          }}
        >
          <Link style={{float: 'left'}} to={link}>{this.props.kingdom.name}</Link>
          {this.renderSets()}
        </Header>
        {this.renderRating()}
      </div>
    )
  }

  renderSets = () => {
    const { sets } = this.props.kingdom;
    return (
      <span style={{marginLeft: 4, display: 'inline-block'}}>
        {sets.map(set => {
          return (<SetSymbol style={{float: 'left', marginLeft: 1}} key={set} set={set} />)
        })}
      </span>
    )
  }

  renderExpandButton = () => {
    return (
      <Button
        compact
        icon={this.state.expanded ? "caret up" : "caret down"}
        onClick={this.toggleExpansion}
        style={{float:'right', marginLeft: 5}}
      />
    )
  }

  renderExpandedKingdom = () => {
    if (!this.state.expanded) return null
    return (
      <Segment>
        <Supply kingdom={this.props.kingdom} />
      </Segment>
    )
  }

  renderUser = () => {
    const { user } = this.props.kingdom
    return (
      <span style={{whiteSpace:'nowrap'}}>
        Author: <Label style={s.secondaryButton} as="a" href={'/users/' + user} basic>{user}</Label>
      </span>
    )
  }

  render() {
    return (
      <Segment.Group>
        <Segment raised padded>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
              {this.renderTitle()}
                <div >
                  {this.renderUser()}
                  {this.renderExpandButton()}
                </div>
            </div>
        </Segment>
        {this.renderExpandedKingdom()}
      </Segment.Group>
    )
  }
}

export default KingdomSummary
