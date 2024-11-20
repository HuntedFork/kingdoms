import React, {Component} from 'react';
import { connect } from "react-redux";

//This HOC handles waiting for authentication to finish checking if the user is logged in
//Then dispatching an api call, and passing the data retrieved down to the child component.
//Also passes down auth info, no need to connect seperately
//Data function is a function(x) that accepts a callback with data x(data)
function loadDataHoc(WrappedComponent, dataFunction){
    class DataLoadingComponent extends Component{
        state = {
          data: undefined,
          loading: true,
          dataRetrieved: false
        }
        componentDidMount() {
          if (this.props.authenticated || this.props.anonymous) {
            this.launchDataRequest()
          }
        }

        componentDidUpdate(prevProps) {
          if (this.state.dataRetrieved) {
            return
          }
          if (
            this.props.authenticated !== prevProps.authenticated ||
            this.props.anonymous!== prevProps.anonymous
          ) {
            this.launchDataRequest()
          }
        }

        launchDataRequest = () => {
          this.setState({loading: true})
          dataFunction(this.handleDataReceived)
        }

        handleDataReceived = data => {
          this.setState({data, loading: false })
        }

        render(){
            return (
                <div>
                    <WrappedComponent
                      data={this.state.data}
                      dataLoading={this.state.loading}
                      {...this.props}
                    >
                    </WrappedComponent>
                </div>
            );
        }
    }
    const mapStateToProps = state => {
      return {
        authenticated: state.auth.token !== null,
        anonymous: state.auth.anonymous,
      };
    };
    return connect(mapStateToProps)(DataLoadingComponent)
}

function withDataLoader(dataFunction) {
  return function (WrappedComponent) {
    return loadDataHoc(WrappedComponent, dataFunction)
  }
}

export default withDataLoader;
