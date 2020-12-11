import actions from "../actions";

export default function displayTag(tag = {}, action) {
  switch (action.type) {
    case actions.STORE_DISPLAY_TAG:
      return action.payload;
    default:
      return tag;
  }
}
