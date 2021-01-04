import actions from "../actions";
import isEmpty from "lodash/isEmpty";

export default function currentUser(currentUser = [], action) {
   // let newCurrentUser = {...currentUser}
   switch (action.type) {
      case actions.STORE_CURRENT_USER:
         if (isEmpty(action.payload)) {
            localStorage.removeItem("authToken");
         }
         return action.payload;
      default:
         return currentUser;
   }
}
