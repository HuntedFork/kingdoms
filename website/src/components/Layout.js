import React from "react";
import {
  Container,
  List,
  Menu,
  Segment,
  Image,
  Dropdown
} from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import Messages from "./Messages"
import { logout } from "../actions/auth";

import '../styles/index.css'
import { styles as s } from "../styles/styles"
import logo from '../img/logo.svg'


class CustomLayout extends React.Component {

  renderMenuLink = (title, location) => {
    return (
        <Menu.Item
          link
          href={location}
          active={window.location.pathname === location}
          header
          style={s.menuItem}
        >
          {title}
        </Menu.Item>
    )
  }

  render() {
    const { authenticated } = this.props;
    return (
      <div style={s.body}>
        <Menu fixed="top" inverted>
          <Menu.Item><img src={logo} /></Menu.Item>
          {authenticated ? (
            <React.Fragment>
              {this.renderMenuLink('My Kingdoms', '/')}
              {this.renderMenuLink('Browse', '/browse')}
              <Dropdown item header style={{marginLeft: "auto", ...s.menuItem}} text={this.props.username || "Unknown"}>
                <Dropdown.Menu>
                  <Dropdown.Item style={s.menuItem} header onClick={() => this.props.logout()}>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {this.renderMenuLink('Browse', '/browse')}
              {this.renderMenuLink('Login', '/login')}
              {this.renderMenuLink('Signup', '/signup')}
            </React.Fragment>
          )}
        </Menu>

        <Messages />

        <div>
          {this.props.children}
        </div>

        <Segment
          inverted
          vertical
          style={{ margin: "5em 0em 0em", padding: "5em 0em" }}
        >
          <Container textAlign="center">
            <List horizontal inverted divided link size="small">
              <List.Item as="a" href="/about">
                About
              </List.Item>
              <List.Item as="a" href="/bug">
                Report a Bug
              </List.Item>
            </List>
          </Container>
        </Segment>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.auth.token !== null,
    username: state.auth.username
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logout())
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CustomLayout)
);
