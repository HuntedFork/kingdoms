import React from "react";
import PropTypes from "prop-types";

import { Dimmer, Button, Modal, Grid, Icon } from "semantic-ui-react";
import Card from "./Card"
import CardFinder from "./CardFinder"

class EditableCard extends React.Component {

  static propTypes = {
    card: PropTypes.object,
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
    landscape: PropTypes.bool,
  };

  state = {
    editing: false,
    consideredCard: null,
    focusRef: null
  };

  componentDidUpdate(prevProps) {
    if (prevProps.card !== this.props.card) {
      this.setState({editing: false})
    }
  }

  handleEdit = () => {
    this.setState({editing: true})
    if (this.state.focusRef) {
      this.state.focusRef.focus()
    }
  }

  handleConsiderCard = card => {
    this.setState({consideredCard: card})
  }

  handleSelection = () => {
    this.setState({editing: false})
    this.props.onChange(this.state.consideredCard)
  }

  handleCancelEdit = (e, data) => {
    e.stopPropagation()
    this.setState({editing: false, consideredCard: null})
  }

  handleDelete = (e, data) => {
    e.stopPropagation()
    this.setState({editing: false})
    this.props.onDelete()
  }

  handleFocusRef = ref => {
    this.setState({focusRef: ref})
  }

  renderDeleteButton = () => {
    if (!this.props.onDelete) { return null }
    return (
      <Button color="red" icon="times circle" onClick={this.handleDelete}/>
    )
  }

  renderSelectModal = () => {
    const cardWidth = this.props.landscape ? 200 : 150
    const colWidth = this.props.landscape ? [7,8,8] : [6,7,7]
    return (
      <Modal
        open={this.state.editing}
        onClose={this.handleCancelEdit}
        size={"tiny"}
        closeOnDocumentClick
      >
        <Modal.Header>Choose a Card</Modal.Header>
        <Modal.Content>
          <Grid verticalAlign="middle">
            <Grid.Column style={{paddingRight:0}} computer={colWidth[0]} tablet={colWidth[1]} mobile={colWidth[2]}>
              <Card style={{maxWidth:cardWidth}} landscape={this.props.landscape} card={this.props.card} />
            </Grid.Column>
            <Grid.Column width={1} style={{padding: 0}}>
              <Icon name="angle right" />
            </Grid.Column>
            <Grid.Column style={{paddingLeft: 0}} computer={colWidth[0]-1} tablet={colWidth[1]-1} mobile={colWidth[2]-1}>
              <Card style={{maxWidth:cardWidth}} landscape={this.props.landscape} card={this.state.consideredCard} />
            </Grid.Column>
            <Grid.Row>
              <Grid.Column computer={4} />
              <Grid.Column width={4}>
                <CardFinder landscape={this.props.landscape} onSelect={this.handleConsiderCard} focusRef={this.handleFocusRef} />
              </Grid.Column>
              <Grid.Column />
            </Grid.Row>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={this.handleCancelEdit}>
            Cancel
          </Button>
          <Button
            content="Select"
            labelPosition='right'
            icon='checkmark'
            onClick={this.handleSelection}
            positive
          />
        </Modal.Actions>
      </Modal>

    )
  }

  render() {
    return (
      <div>
        {this.renderSelectModal()}
        <Dimmer.Dimmable dimmed={this.state.editing} onClick={this.handleEdit}>
          <Card landscape={this.props.landscape} card={this.props.card} />
        </Dimmer.Dimmable>
      </div>
    )
  }
}

export default EditableCard;
