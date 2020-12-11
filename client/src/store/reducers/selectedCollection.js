import actions from "../actions";

export default function selectedCollection(collection = {}, action) {
  switch (action.type) {
    case actions.STORE_SELECTED_COLLECTION:
      return action.payload;
    default:
      return collection;
  }
}
