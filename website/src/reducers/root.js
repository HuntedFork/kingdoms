import { combineReducers } from "redux";

import authReducer from "./auth";
import messageReducer from "./messages"

export default combineReducers({
  auth: authReducer,
  messages: messageReducer
});
