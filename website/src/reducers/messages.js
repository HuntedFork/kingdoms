import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const addMessage = (state, action) => {
  return updateObject(state, {
    messages: [action.data, ...state.messages]
  })
}

const dismissMessage = (state, action) => {
  return updateObject(state, {
    messages: state.messages.filter(msg => msg.id !== action.id)
  })
}

const initialState = {
  messages: []
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_MESSAGE:
      return addMessage(state, action)
    case actionTypes.DISMISS_MESSAGE:
      return dismissMessage(state, action)
    default:
      return state;
  }
};

export default reducer;
