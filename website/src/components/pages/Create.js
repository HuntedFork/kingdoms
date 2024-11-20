import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import EditableKingdom from "../EditableKingdom"

class CreateLayout extends Component {
  state = {
    created: false
  }

  renderRedirect = () => {
    return this.state.created ?
      (
        <Redirect to={"/kingdom/"+this.state.created} />
      ) :
      null
  }

 render() {
   if (this.props.anonymous) {
     return (<Redirect to="/login" />)
   }
   return (
     <div style={{marginTop: 50, overflow: "auto"}}>
         <EditableKingdom
           onSave={newKingdom=>this.setState({created:newKingdom.pk})}
          />
          {this.renderRedirect()}
      </div>
   )
 }
};
const mapStateToProps = state => {
  return {
    authenticated: state.auth.token !== null,
    anonymous: state.auth.anonymous
  };
};

const mapDispatchToProps = dispatch => {
  return { };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateLayout);