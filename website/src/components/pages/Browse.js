import React, { Component } from "react";
import {
  Segment,
  Loader,
  Header,
  Container
} from "semantic-ui-react";

import loadDataHoc from "../utils/loadDataHOC.js"
import KingdomList from "../KingdomList.js"
import { searchKingdoms } from "../../actions/kingdoms.js"

import { styles as s } from "../../styles/styles.js"

class BrowseLayout extends Component {

  renderLoader = () => {
    if (this.props.dataLoading) {
      return <Loader active />
    } else {
      return null
    }
  }

  renderHelpText = () => {
    if (this.props.authenticated) {
      return null
    }
    return (
      <p>Login or signup to create your own kingdoms!</p>
    )
  }

 render() {
   return (
     <Container style={s.pageBody}>
       <Header style={s.pageHeader}>Browse Kingdoms:</Header>
       {this.renderHelpText()}
       {this.renderLoader()}
       <KingdomList kingdoms={this.props.data || []} />
     </Container>
   )
 }
};

export default loadDataHoc(searchKingdoms)(BrowseLayout)
