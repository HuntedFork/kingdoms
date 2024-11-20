import * as actionTypes from "../actionTypes";


const addMessage = (title, message, type) => {
  return dispatch => {
    dispatch({
      type: actionTypes.ADD_MESSAGE,
      data: {
        id: Date.now(),
        title: title,
        content: message,
        time: Date.now(),
        type: type
      }
    })
  };
};


export const addError = (title, message) => addMessage(title, message, "error")
export const addStatus = (title, message) => addMessage(title, message, "status")

export const dismissMessage = id => {
  return dispatch => {
    dispatch({
      type: actionTypes.DISMISS_MESSAGE,
      id: id
    })
  }
}
