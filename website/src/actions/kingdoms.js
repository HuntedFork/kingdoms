import axios from "axios";
import { apiCall } from "./shared.js"
import { sortFunctionCreator, apiUrlCreator } from "../utility.js"
import CARDS from "../cards.js"

export const getKingdom = (kingdomId, callback, errorCallback) => {
  const url = "/api/kingdoms/" + kingdomId + "/";
  apiCall(url, kingdom => callback(hydrateKingdom(kingdom)), errorCallback);
}

export const getMyKingdoms = (callback, err) => {
  const url = "/api/kingdoms/?limit_self=true"
  apiCall(url, kingdoms => callback(hydrateKingdomList(kingdoms)), err)
}

export const getUsersKingdoms = (username, callback, err) => {
  const url = "/api/kingdoms/?published=true,user=" + username
  apiCall(url, kingdoms => callback(hydrateKingdomList(kingdoms)), err)
}

export const searchKingdoms = (callback, err) => {
  const url = "/api/kingdoms/?published=true"
  apiCall(url, kingdoms => callback(hydrateKingdomList(kingdoms)), err)
}

export const createKingdom = (kingdom, callback, errorCallback) => {
  const url = "/api/kingdoms/"
  axios
    .post(apiUrlCreator(url), dehydrateKingdom(kingdom))
    .then(res => {
      if (callback) {
        callback(hydrateKingdom(res.data));
      }
    })
    .catch(err => {
      if (errorCallback) {
        errorCallback(err.response ? err.response.data : "")
      }
    })
}

export const updateKingdom = (kingdom, callback, errorCallback) => {
  const url = "/api/kingdoms/" + kingdom.pk + "/"
  axios
    .put(apiUrlCreator(url), dehydrateKingdom(kingdom))
    .then(res => {
      if (callback) {
        callback(hydrateKingdom(res.data));
      }
    })
    .catch(err => {
      if (errorCallback) {
        errorCallback(err.response ? err.response.data : "")
      }
    })
}

export const deleteKingdom = (kingdomId, callback, errorCallback) => {
  const url = "/api/kingdoms/" + kingdomId + "/"
  axios
    .delete(apiUrlCreator(url))
    .then(res => {
      if (callback) {
        callback()
      }
    })
    .catch(err => {
      if (errorCallback) {
        errorCallback(err.response ? err.response : "")
      }
    })
}

export const rateKingdom = (kingdomId, rating, callback, errorCallback) => {
  const url = "/api/kingdoms/" + kingdomId + "/rate/"
  axios
    .put(apiUrlCreator(url), {'rating': rating})
    .then(res => {
      if (callback) {
        callback(hydrateKingdom(res.data))
      }
    })
    .catch(err => {
      if (errorCallback) {
        errorCallback(err.response ? err.response : "")
      }
    })
}

const hydrateKingdom = kingdom => {
    const cards = CARDS;
    let supply = kingdom.supply.map(cardname => cards.find(card => card.name === cardname));
    supply.sort(sortFunctionCreator((card1, card2) => {
      if (card1 == null) return true
      if (card2 == null) return false
      if (card1.cost === card2.cost) return card1.name > card2.name
      return card1.cost > card2.cost
    }))
    let landscapes = kingdom.landscapes.map(cardname => cards.find(card => card.name === cardname));
    return {...kingdom, supply: supply, landscapes: landscapes}
  }

const hydrateKingdomList = kingdomList => {
  return kingdomList.map(kingdom => hydrateKingdom(kingdom))
}

const dehydrateKingdom = kingdom => {
  let supply = kingdom.supply.filter(card => card!=null).map(card => card.name)
  let landscapes = kingdom.landscapes.filter(card => card!=null).map(card => card.name)
  supply = supply.filter(card => card != null)
  landscapes = landscapes.filter(card => card != null)
  return {...kingdom, supply: supply, landscapes: landscapes}
}
