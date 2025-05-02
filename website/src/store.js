import { createStore, compose, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";

import rootReducer from './reducers/root'

const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(rootReducer, composeEnhances(applyMiddleware(thunk)));
