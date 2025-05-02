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
import { resetPassword } from "../../actions/auth";
import { addStatus, addError } from "../../actions/redux/messages"

class ResetPassword extends React.Component {
  state = {
    email: "",
    loading: false
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { email } = this.state;
    resetPassword(email, this.handleReset, this.handleError);
  };

  handleError = err => {
    this.props.addError(
      "Error sending password reset email",
      "Check the email address and try again"
    )
  }

  handleReset = msg => {
    this.props.addStatus(msg.detail)
  }

  render() {
    const { token } = this.props;
    const { email, loading } = this.state;
    if (token) {
      return <Redirect to="/" />;
    }
    return (
      <Grid
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="teal" textAlign="center">
            Forgot your password?
          </Header>

          <React.Fragment>
            <Form size="large" onSubmit={this.handleSubmit}>
              <Segment stacked>
                <Form.Input
                  onChange={this.handleChange}
                  value={email}
                  name="email"
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Email"
                />

                <Button
                  color="teal"
                  fluid
                  size="large"
                  loading={loading}
                  disabled={loading}
                >
                  Send Reset Email
                </Button>
              </Segment>
            </Form>
            <Message>
              <NavLink to="/login">Log In</NavLink>
            </Message>
            <Message>
              New here? <NavLink to="/signup">Sign Up</NavLink>
            </Message>
          </React.Fragment>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  return {
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
)(ResetPassword);
