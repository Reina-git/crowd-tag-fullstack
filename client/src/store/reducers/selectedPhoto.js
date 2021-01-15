import actions from "../actions";

export default function selectedPhoto(photo = {}, action) {
   let newSelectedPhoto = { ...photo };
   switch (action.type) {
      case actions.STORE_SELECTED_PHOTO:
         newSelectedPhoto.photo = action.payload.photo;
         newSelectedPhoto.prevRoute = action.payload.prevRoute;
         return newSelectedPhoto;
      default:
         return photo;
   }
}
