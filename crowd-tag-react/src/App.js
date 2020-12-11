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
        <Route exact path="/admin-collections" component={AdminCollections} />
        <Route exact path="/collection" component={Collection} />
        <Route exact path="/image" component={Image} />
        <Route exact path="/library-log-in" component={LibraryLogin} />
        <Route exact path="/log-in" component={Login} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}
export default App;
