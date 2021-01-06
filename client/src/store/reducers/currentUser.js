import actions from "../actions";
import isEmpty from "lodash/isEmpty";
import axios from "axios";

export default function currentUser(currentUser = [], action) {
   // let newCurrentUser = {...currentUser}
   switch (action.type) {
      case actions.STORE_CURRENT_USER:
         if (isEmpty(action.payload)) {
            // localStorage.removeItem("authToken");
            // delete axios.defaults.headers.common["x-auth-token"];
         }
         return action.payload;
      default:
         return currentUser;
   }
}
