import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import {
  Segment,
  Button,
  Icon,
  Loader,
  Header,
  Container
} from "semantic-ui-react";

import loadDataHoc from "../utils/loadDataHOC.js"
import KingdomList from "../KingdomList.js"
import { getMyKingdoms } from "../../actions/kingdoms.js"

import { styles as s } from "../../styles/styles.js"

class HomepageLayout extends Component {

  renderLoader = () => {
    if (this.props.dataLoading) {
      return <Loader active />
    } else {
      return null
    }
  }

 render() {
  console.log('rendering!', this.props)
   if (this.props.anonymous) {
     return (<Redirect to="/browse" />)
   }
   return (
     <Container style={s.pageBody}>
       <Header style={s.pageHeader} >My Kingdoms</Header>
       <Link to="/create"><Button style={{marginBottom:5, ...s.primaryButton}}><Icon name="plus" />New Kingdom</Button></Link>
       {this.renderLoader()}
       <KingdomList kingdoms={this.props.data || []} />
     </Container>
   )
 }
};

export default loadDataHoc(getMyKingdoms)(HomepageLayout)
