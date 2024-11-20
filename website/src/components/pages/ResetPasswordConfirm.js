import React from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment
} from "semantic-ui-react";
import { connect } from "react-redux";
import { NavLink, Redirect } from "react-router-dom";
import { confirmPasswordReset } from "../../actions/auth";
import { addStatus, addError } from "../../actions/redux/messages"

class ResetPasswordConfirm extends React.Component {
  state = {
    loading: false,
    newPassword1: "",
    newPassword2: "",
    passwordHasBeenReset: false,
    errors: undefined
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { newPassword1, newPassword2 } = this.state;
    const { uid, token } = this.props.match.params;
    this.setState({
      loading: true,
      errors: undefined
    })
    confirmPasswordReset(
      uid,
      token,
      newPassword1,
      newPassword2,
      this.handleReset,
      this.handleError
    );
  };

  handleReset = msg => {
    this.props.addStatus(
      "Password changed successfully!",
      "You can log in using your new password"
    )
    this.setState({loading: false, passwordHasBeenReset: true})
  }

  handleError = err => {
    const errors = []
    const data = err.response.data
    for (const element in data) {
      if (element === "new_password1") {
        errors.push("Password 1 error: " + data[element])
      } else if (element === "new_password2") {
        errors.push("Password 2 error: " + data[element])
      } else if (element === "token" || element === "uid") {
        this.props.addError(
          "Error resetting your password",
          "Something might be wrong with the link, try requesting a new one?"
        )
      }
    }
    if (errors.length > 0) { this.setState({ errors }) }
  }

  renderErrors = () => {
    if (!this.state.errors) {
      return null
    }
    return (
      <Message>
        {this.state.errors.map(error => {
          return (
            <Message.Item>{error}</Message.Item>
          )
        })}
      </Message>
    )
  }

  render() {
    const { token } = this.props;
    const { loading, newPassword1, newPassword2, passwordHasBeenReset } = this.state;
    if (token) {
      return <Redirect to="/" />;
    }
    if (passwordHasBeenReset) {
      return <Redirect to="/login" />;
    }
    return (
      <Grid
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="teal" textAlign="center">
            Change your password
          </Header>
          {this.renderErrors()}

          <React.Fragment>
            <Form size="large" onSubmit={this.handleSubmit}>
              <Segment stacked>
                <Form.Input
                  onChange={this.handleChange}
                  value={newPassword1}
                  name="newPassword1"
                  fluid
                  placeholder="New Password"
                  type="password"
                />
                <Form.Input
                  onChange={this.handleChange}
                  value={newPassword2}
                  name="newPassword2"
                  fluid
                  placeholder="Retype Password"
                  type="password"
                />

                <Button
                  color="teal"
                  fluid
                  size="large"
                  loading={loading}
                  disabled={loading}
                >
                  Reset Password
                </Button>
              </Segment>
            </Form>
            <Message>
              <NavLink to="/login">Log In</NavLink>
            </Message>
            <Message>
              <NavLink to="/reset-password">Request a new link</NavLink>
            </Message>
          </React.Fragment>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    token: state.auth.token
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addStatus: (title, message) => dispatch(addStatus(title, message)),
    addError: (title, message) => dispatch(addError(title, message))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetPasswordConfirm);
