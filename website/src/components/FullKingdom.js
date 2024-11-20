import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Header, Loader, Divider, Grid, Rating, Button, Modal, Popup, Icon , Container} from "semantic-ui-react";
import Supply from "./Supply"

import { styles as s } from "../styles/styles"



class FullKingdom extends React.Component {

  static propTypes = {
    kingdom: PropTypes.object,
    onRatingSubmit: PropTypes.func
  };

  state = {
    ratingModalOpen: false,
    rating: null
  }

  handleRating = () => {
    this.setState({ratingModalOpen: false})
    this.props.onRatingSubmit(this.state.rating)
  }

  renderName = () => {
    return (
      <Header
        style={{
          overflow:"hidden",
          textOverflow:"ellipsis"
        }}
        size="huge">
        {this.props.kingdom.name}
      </Header>
    )
  }

  renderDescription = () => {
    return (<div><p>{this.props.kingdom.description}</p></div>)
  }

  renderRating = () => {
    if (this.props.anonymous) {
      return null
    }
    return (
      <Rating
        icon="star"
        disabled
        rating={this.props.kingdom.rating}
        maxRating={5}
      />
    )
  }

  renderRatingModal = () => {
    if (this.props.anonymous) {
      return null
    }
    return (
      <Modal
        onOpen={() => this.setState({ratingModalOpen: true, rating: null})}
        onClose={() => this.setState({ratingModalOpen: false})}
        open={this.state.ratingModalOpen}
        trigger={<Button style={s.primaryButton}>{"Rate This Kingdom"}</Button>}
      >
        <Modal.Header>{"Rate This Kingdom"}</Modal.Header>
        <Modal.Content>
          <div style={{width: 70, margin: "auto"}}>
            <Rating
              rating={this.state.rating}
              onRate={(e, {rating, maxRating}) => this.setState({ rating })}
              maxRating={5}
              icon="star"
              clearable
            />
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => this.setState({ratingModalOpen: false})}>
            Cancel
          </Button>
          <Button
            content="Submit"
            onClick={this.handleRating}
            disabled={!this.state.rating}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }

  renderKingdomHeader = () => {
    return (
      <div className="kingdomHeader">
        <Grid columns="equal" stackable>
          <Grid.Row>
            <Grid.Column floated="left">
              {this.renderName()}
            </Grid.Column>
            <Grid.Column computer={2} tablet={3} mobile={3}>
              {this.renderRating()}
              {this.renderScore()}
            </Grid.Column>
            <Grid.Column width={3}>
              {this.renderRatingModal()}
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider hidden />
        {this.renderDescription()}
        <Divider hidden />
      </div>
    )
  }

  renderScore = () => {
    const scoreValue = this.props.kingdom.published ? this.props.kingdom.score : "--"
    const helpText = this.props.kingdom.published ?
      "Kingdoms earn score as users play and rate them. A user rating a kingdom increases its score, and increases it by more if they rate it well." :
      "Your kingdom doesn't have a score yet because it isn't finished. (Has less then 10 kingdom cards)."
    return (
      <span style={{'whiteSpace': 'nowrap'}}>
        {'Kingdom Score: ' + scoreValue}
        <Popup
          header={"How score works"}
          content={helpText}
          trigger={<Icon name="question circle" />}
        />
      </span>
    )
  }

  renderPlaceholder = () => {
    return (<Loader />)
  }

  render() {
    if (!this.props.kingdom) { return this.renderPlaceholder() }
    return (
      <div>
        {this.renderKingdomHeader()}
        <Supply kingdom={this.props.kingdom} />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.auth.token !== null,
    anonymous: state.auth.anonymous
  };
};

const mapDispatchToProps = dispatch => {
  return { };
}

export default connect(mapStateToProps, mapDispatchToProps)(FullKingdom);
