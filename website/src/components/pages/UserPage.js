import React, { Component } from "react";
import {
  Segment,
  Loader,
  Header
} from "semantic-ui-react";

import loadDataHoc from "../utils/loadDataHOC.js"
import KingdomList from "../KingdomList.js"
import { getUsersKingdoms } from "../../actions/kingdoms.js"

class UserPage extends Component {

  renderLoader = () => {
    if (this.props.dataLoading) {
      return <Loader active />
    } else {
      return null
    }
  }

 render() {
   return (
     <Segment style={{ padding: "8em 0em" }} vertical>
       {this.renderLoader()}
       <Header>{"Kingdoms by user: " + this.props.user}</Header>
       <KingdomList kingdoms={this.props.data || []} />
     </Segment>
   )
 }
};

class UserPageWrapper extends Component {
  getKingdomList = callback => {
    const user = this.props.match.params.userId;
    getUsersKingdoms(user, callback)
  }

  render() {
    const UserPageWithKingdoms = loadDataHoc(this.getKingdomList)(UserPage)
    return (
      <UserPageWithKingdoms user={this.props.match.params.userId} />
    )
  }
}

export default UserPageWrapper
