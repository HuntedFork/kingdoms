import React from "react";
import PropTypes from "prop-types";

import { Form, TextArea, Button, Modal } from "semantic-ui-react";


class ImportModal extends React.Component {

  static propTypes = {
    open: PropTypes.bool,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func
  };

  state = {
    text: ""
  };

  handleCancelEdit = () => {
    this.props.onCancel()
  }

  handleSelection = () => {
    this.props.onSubmit(this.state.text)
  }

  render() {
    return (
        (
            <Modal
              open={this.props.open}
              onClose={this.handleCancelEdit}
              size={"tiny"}
              closeOnDocumentClick
            >
              <Modal.Header>One Card Per Line</Modal.Header>
              <Modal.Content>
                <Form>
                    <TextArea
                        placeholder="Chapel, Thief"
                        value={this.state.text}
                        onChange={e => this.setState({ text: e.target.value })}
                    />
                </Form>
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
    )
  }
}

export default ImportModal;
