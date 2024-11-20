import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  Segment,
  Button,
  Icon,
  Loader,
  Popup,
  Confirm
} from "semantic-ui-react";

import FullKingdom from "../FullKingdom"
import EditableKingdom from "../EditableKingdom"
import NotFound from "./NotFound"

import { addError, addStatus } from "../../actions/redux/messages"
import { getKingdom, deleteKingdom, rateKingdom } from "../../actions/kingdoms"

import { styles as s } from "../../styles/styles"

class KingdomLayout extends Component {
  state = {
    kingdom: null,
    loading: true,
    editing: false,
    deleted: false,
    confirmingDelete: false,
    notFound: false,
    copied: false
  }

  componentDidMount() {
    const id = this.props.match.params.kingdomId;
    if (this.props.authenticated || this.props.anonymous) {
      getKingdom(id, this.handleKingdomReceived, this.handleKingdomNotFound);
    }
  }

  componentDidUpdate(prevProps) {
    const id = this.props.match.params.kingdomId;
    if (
      this.props.authenticated !== prevProps.authenticated ||
      this.props.anonymous!== prevProps.anonymous
    ) {
      getKingdom(id, this.handleKingdomReceived, this.handleKingdomNotFound);
    }
  }

  handleKingdomNotFound = () => {
    this.setState({notFound: true, loading: false})
  }

  handleKingdomWasDeleted = () => {
    this.props.addStatus("Kingdom deleted successfully")
    this.setState({deleted: true})
  }

  handleKingdomReceived = kingdom => {
    this.setState({kingdom, loading: false})
  }

  handleRating = rating => {
    rateKingdom(
      this.state.kingdom.pk,
      rating,
      this.handleKingdomReceived,
      err => this.props.addError("Something went wrong submitting your review", err.statusText)
    )
  }

  handleEditMode = () => {
    this.setState({editing: true})
  }

  handleDelete = () => {
    console.log('lets delete!')
    this.setState({confirmingDelete: true})
  }

  handleDeleteConfirm = () => {
    deleteKingdom(
      this.state.kingdom.pk,
      this.handleKingdomWasDeleted,
      msg => this.props.addError("Something went wrong deleting the kingdom", msg)
    )
  }

  handleCopy = () => {
    const text = [
      ...this.state.kingdom.supply,
      ...this.state.kingdom.landscapes
    ].flatMap(card => {
      return card ? [card.name] : []
    }).join(', ')
    this.setState({copied: true})
    navigator.clipboard.writeText(text)
    setTimeout(()=>this.setState({copied: false}), 2000)
  }

  renderEditButtons = () => {
    if (this.state.kingdom.user !== this.props.user) {
      return null
    }
    return (
      <div>
        <Button onClick={this.handleEditMode} positive style={{marginTop:5, float:"right"}}><Icon name="edit" />Edit</Button>
        <Button onClick={this.handleDelete} negative><Icon name="trash"/>Delete</Button>
      </div>
    )
  }

  renderKingdom = () => {
    return (
      <div style={{ maxWidth: 1200}}>
        <FullKingdom
          kingdom={this.state.kingdom}
          onRatingSubmit={this.handleRating}
        />
        {this.renderEditButtons()}
        <Popup
          content="Copied!"
          open={this.state.copied}
          position="right center"
          trigger={
            <Button
              style={{"marginTop": 5}}
              basic
              icon="paste"
              onClick={this.handleCopy}
            />
          }
        />
      </div>
    )
  }

  renderEditingKingdom = () => {
    return (
      <div style={{maxWidth: 1200}}>
        <EditableKingdom
          kingdom={this.state.kingdom}
          onSave={newKingdom=>this.setState({kingdom:newKingdom, editing: false})}
          onCancel={()=>this.setState({editing: false})}
        />
      </div>
    )
  }

  renderConfirmDeleteModal = () => {
    return (
      <Confirm
        content='Are you sure you want to delete this kingdom?'
        open={this.state.confirmingDelete}
        onCancel={() => this.setState({confirmingDelete: false})}
        onConfirm={this.handleDeleteConfirm}
        size='large'
      />
    )
  }

 render() {
   if (this.state.deleted) {
     return (<Redirect to="/" />)
   }
   if (this.state.loading) {
     return (<Loader disabled={true} active size="huge" inline="centered" style={{marginTop: 50}} />)
   }
   if (this.state.notFound) {
     return (<NotFound />)
   }
   return (
     <Segment vertical style={{marginLeft: 20, ...s.pageBody}}>
       <div style={{maxWidth: 1200, ...s.contentContainer}}>
           {this.renderConfirmDeleteModal()}
           {this.state.editing ? this.renderEditingKingdom() : this.renderKingdom()}
      </div>
     </Segment>
   )
 }
};
const mapStateToProps = state => {
  return {
    authenticated: state.auth.token !== null,
    anonymous: state.auth.anonymous,
    user: state.auth.username
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addError: (title, message) => dispatch(addError(title, message)),
    addStatus: (title, message) => dispatch(addStatus(title, message))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(KingdomLayout);
