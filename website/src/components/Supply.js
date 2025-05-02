import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Grid, Icon } from "semantic-ui-react";
import Card from "./Card"
import EditableCard from "./EditableCard"

import { styles as s } from "../styles/styles"

class Kingdom extends React.Component {

  static propTypes = {
    kingdom: PropTypes.object,
    editable: PropTypes.bool,
    onSupplyChange: PropTypes.func,
    onLandscapeChange: PropTypes.func,
    creation: PropTypes.bool
  };

  state = {};

  createSupply(cards) {
    let supply = cards;
    while (supply.length < 10) {
      supply.push(null)
    }
    return supply
  }

  handleSupplyCardChange = (i, newCard) => {
    const kingdom = this.props.kingdom
    kingdom.supply[i] = newCard
    this.props.onSupplyChange(kingdom.supply)
  }

  handleLandscapeCardChange = (i, newCard) => {
    const landscapes = this.props.kingdom.landscapes
    if (i === landscapes.length) {
      landscapes.push(newCard)
    } else {
      landscapes[i] = newCard
    }
    this.props.onLandscapeChange(landscapes)
  }

  handleLandscapeCardDelete = i => {
    const landscapes = this.props.kingdom.landscapes
    landscapes.splice(i, 1)
    this.props.onLandscapeChange(landscapes)
  }

  renderOption = text => {
    return (
      <span style={{paddingLeft: "1rem"}}><Icon name="check"/>{text}</span>
    )
  }

  renderSupplyOptions = () => {
    if (this.props.editable) {return null}
    const { prosperity, shelters } = this.props.kingdom
    if (!prosperity && !shelters) { return null }
    return (
      <Grid.Row>
        {shelters ? this.renderOption("Use Shelters") : null}
        {prosperity ? this.renderOption("Include Colony/Platinum") : null}
      </Grid.Row>
    )
  }

  renderSupplyCards = supply => {
    return (
      <Grid columns={5} style={{margin:2, maxWidth: '800px'}}>
        {supply.map((card, i) => {
            return (
              <Grid.Column key={i} style={{padding: 2}}>
                {
                this.props.editable ?
                  <EditableCard
                    onChange={newCard => this.handleSupplyCardChange(i, newCard)}
                    card={card}
                  /> :
                  <Card card={card} />
                }
              </Grid.Column>
            )
        })}
      </Grid>
    )
  }

  renderLandscapeRow(landscapes) {
    const cards = landscapes
    const placeholder = null
    while (this.props.editable && cards.length < 2) {
      cards.push(placeholder)
    }
    return (
      <Grid columns={3} style={{margin:2, maxWidth: '800px'}}>
        {landscapes.map((card, i) => {
          return (
            <Grid.Column style={{padding:2}} key={i}>
              {this.props.editable ?
              <EditableCard
                onChange={newCard => this.handleLandscapeCardChange(i, newCard)}
                onDelete={()=>this.handleLandscapeCardDelete(i)}
                card={card}
                landscape
              /> :
              <Card key={i} card={card} landscape />}
            </Grid.Column>
          )
        })}
      </Grid>
    )
  }

  renderSupply = (supply, landscapes) => {
    let supplyCards = this.createSupply(supply)

    return (
      <div>
        {this.renderSupplyOptions()}
        {this.renderSupplyCards(supplyCards)}
        {this.renderLandscapeRow(landscapes)}
      </div>
    )
  }

  render() {
    if (!this.props.kingdom || !this.props.kingdom.supply) {
      return this.renderSupply([], [])
    }
    return this.renderSupply(this.props.kingdom.supply, this.props.kingdom.landscapes)
  }
}


const mapStateToProps = state => { return {} };

const mapDispatchToProps = dispatch => {
  return { };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Kingdom);
