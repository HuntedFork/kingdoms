import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Input, Icon, TextArea, Form, Header, Button, Checkbox, Confirm } from "semantic-ui-react";
import { updateKingdom, createKingdom } from "../actions/kingdoms"
import { addError, addStatus } from "../actions/redux/messages"
import Supply from "./Supply"

import { styles as s } from "../styles/styles"


class EditableKingdom extends React.Component {

  static propTypes = {
    kingdom: PropTypes.object,
  };

  state = {
    name: '',
    description: '',
    supply: [],
    landscapes: [],
    shelters: false,
    prosperity: false,
    saving: false,
    changed: false,
    confirmingCancel: false
  };

  componentDidMount() {
    if (this.props.kingdom) {
      //Best deep copy hack I have
      const newSupply = this.props.kingdom.supply.map(x=>x)
      const newLandscapes = this.props.kingdom.landscapes.map(x=>x)
      this.setState({
        ...this.props.kingdom,
        supply: newSupply,
        landscapes: newLandscapes
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.kingdom !== this.props.kingdom) {
      this.setState({
        ...this.props.kingdom,
        changed: false
      })
    } else {
      window.onbeforeunload = this.state.changed ? () => true : undefined
    }
  }

  componentWillUnmount() {
    window.onbeforeunload = undefined
  }

  structureKingdom = () => {
    const pk = this.state.pk ? this.state.pk : undefined
    const {name, description, supply, landscapes, shelters, prosperity} = this.state
    return {
      pk,
      name,
      description,
      supply,
      landscapes,
      shelters,
      prosperity
    }
  }

  saveKingdom = () => {
    this.setState({saving: true})
    if (this.state.pk === undefined) {
      createKingdom(
        this.structureKingdom(),
        this.handleCreated,
        res => {
          this.props.addError("Something went wrong creating the kingdom", res);
          this.setState({saving: false})
        }
      )
    } else {
      updateKingdom(
        this.structureKingdom(),
        this.handleSaved,
        res => {
          this.props.addError("Something went wrong updating the kingdom", res);
          this.setState({saving: false})
        })
    }
  }

  handleCreated = newKingdom => {
    this.setState({...newKingdom, changed: false, saving:false})
    this.props.addStatus("Saved!", "Your kingdom was created successfully")
    this.props.onSave(newKingdom)
  }

  handleSaved = newKingdom => {
    this.setState({...newKingdom, changed: false, saving:false})
    this.props.addStatus("Saved!", "")
    this.props.onSave(newKingdom)
  }

  handleSupplyChange = (supply) => {
    this.setState({supply, changed: true})
  }

  handleNameChange = (event, data) => {
    this.setState({name: data.value.substring(0, 50), changed: true})
  }

  handleDescriptionChange = (event, data) => {
    this.setState({description: data.value.substring(0,3000), changed: true})
  }

  handleCancel = () => {
    if (this.state.changed) {
      this.setState({confirmingCancel: true})
    } else {
      this.props.onCancel()
    }
  }

  handleCancelButtonConfirm = () => {
    this.setState({confirmingCancel: false})
    this.props.onCancel()
  }

  renderName = () => {
    return (
      <Form onSubmit={this.handleNameChange}>
        <Header>Kingdom Name: </Header>
        <Input
          fluid
          size="huge"
          value={this.state.name}
          placeholder="Kingdom Name"
          onChange={this.handleNameChange}
        />
      </Form>
    )
  }

  renderDescription = () => {
    return (
      <Form>
        <Header>Description: </Header>
        <TextArea
          value={this.state.description}
          onChange={this.handleDescriptionChange}
        />
      </Form>
    )
  }

  renderOption = text => {
    return (
      <span style={{paddingRight: 10}}><Icon name="check"/>{text}</span>
    )
  }

  renderSupplyOptions = () => {
    return (
      <span>
        <Checkbox
          label="Use Shelters"
          checked={this.state.shelters}
          onChange={()=>this.setState({shelters: !this.state.shelters, changed: true})}
          style={{paddingRight: 10}}
        />
        <Checkbox
          label="Use Colony/Platinum"
          checked={this.state.prosperity}
          onChange={()=>this.setState({prosperity: !this.state.prosperity, changed: true})}
        />
      </span>
    )
  }

  renderKingdomHeader = () => {
    return (
      <div className="kingdomHeader">
        {this.renderName()}
        <br />
        {this.renderDescription()}
      </div>
    )
  }

  render() {
    return (
      <div style={{maxWidth: 1000}}>
{/*         TODO: Replace this with a different prompt component
        <Prompt
          when={this.state.changed}
          message='Are you sure you want to leave without saving?'
        /> */}
        {this.renderKingdomHeader()}
        {this.renderSupplyOptions()}
        <br />
        {'  (Cards will be sorted by cost after you save)'}
        <Supply
          kingdom={this.structureKingdom()}
          editable
          created={this.state.pk === undefined}
          onSupplyChange={supply=>{this.setState({supply, changed: true})}}
          onLandscapeChange={landscapes=>{this.setState({landscapes, changed: true})}}
        />
        <Button
          primary
          loading={this.state.saving}
          disabled={!this.state.changed && !this.state.saving}
          onClick={this.saveKingdom}
          style={{float:"right", ...s.primaryButton}}
          >
            Save
        </Button>
        {this.props.onCancel ?
          (<Button
            disabled={this.state.saving}
            onClick={this.handleCancel}
            style={{float:"right", ...s.secondaryButton}}
            >
              Cancel
          </Button>)
          :
          null
        }
        <Confirm
          content='Do you want to discard your changes?'
          open={this.state.confirmingCancel}
          onCancel={() => this.setState({confirmingCancel: false})}
          onConfirm={this.handleCancelButtonConfirm}
          size='large'
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    addError: (title, message) => dispatch(addError(title, message)),
    addStatus: (title, message) => dispatch(addStatus(title, message))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditableKingdom);
