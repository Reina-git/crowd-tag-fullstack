import actions from "../actions";

export default function selectedPhoto(photo = {}, action) {
  switch (action.type) {
    case actions.STORE_SELECTED_PHOTO:
      return action.payload;
    default:
      return photo;
  }
}
