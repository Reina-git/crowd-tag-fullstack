import actions from "../actions";

export default function allCollections(allCollections = {}, action) {
  let newSelection = { ...allCollections };
  switch (action.type) {
    case actions.STORE_ALL_COLLECTIONS:
      newSelection = action.payload;
      return newSelection;

    default:
      return allCollections;
  }
}
