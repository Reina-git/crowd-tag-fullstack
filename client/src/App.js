import React from "react";
import "./style/master.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AdminAddPhotoCollection from "./components/pages/AdminAddPhotoCollection";
import Landing from "./components/pages/Landing";
import AdminCollections from "./components/pages/AdminCollections";
import Collection from "./components/pages/Collection";
import Image from "./components/pages/Image";
import LibraryLogin from "./components/pages/LibraryLogin";
import Login from "./components/pages/Login";
import NotFound from "./components/pages/NotFound";
import jwtDecode from "jwt-decode";
import store from "./store/store";
import actions from "./store/actions";
import axios from "axios";
import S3 from "./components/pages/S3";
const authToken = localStorage.authToken;

if (authToken) {
   const currentTimeInSec = Date.now() / 1000;
   const user = jwtDecode(authToken);
   if (currentTimeInSec > user.exp) {
      console.log("expiredToken");
      store.dispatch({
         type: actions.STORE_CURRENT_USER,
         payload: {},
      });
      delete axios.defaults.headers.common["x-auth-token"];
   } else {
      console.log("valid token");
      store.dispatch({
         type: actions.STORE_CURRENT_USER,
         payload: user,
      });
      // set authorization headers for every request
      axios.defaults.headers.common["x-auth-token"] = authToken;
      const currentUrl = window.location.pathname;
      if (currentUrl === "/log-in") {
         window.location.href = "/";
      }
   }
} else {
   console.log("no token");
   delete axios.defaults.headers.common["x-auth-token"];
}

function App() {
   return (
      <Router>
         <Switch>
            <Route exact path="/" component={Landing} />
            <Route
               exact
               path="/admin-add-photo-collection"
               component={AdminAddPhotoCollection}
            />
            <Route
               exact
               path="/admin-collections"
               component={AdminCollections}
            />
            <Route exact path="/collection" component={Collection} />
            <Route exact path="/image" component={Image} />
            <Route exact path="/library-log-in" component={LibraryLogin} />
            <Route exact path="/log-in" component={Login} />
            <Route exact path="/s3" component={S3} />
            <Route component={NotFound} />
         </Switch>
      </Router>
   );
}
export default App;
