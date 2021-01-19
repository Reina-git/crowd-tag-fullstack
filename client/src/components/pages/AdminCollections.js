import React from "react";
import AppTemplate from "../ui/AppTemplate";
import { Link } from "react-router-dom";
import AddIcon from "../../icons/icon-add.svg";
import AdminCollectionUI from "../ui/AdminCollectionUI";
import axios from "axios";
import { connect } from "react-redux";
import actions from "../../store/actions";
import without from "lodash/without";

class AdminCollections extends React.Component {
   constructor(props) {
      super(props);
      // console.log("props", this.props.allCollections);
      const allCollections = this.props.allCollections;
      this.state = {
         displayedCollections: allCollections,
      };
      this.deleteCollection = this.deleteCollection.bind(this);
   }

   componentDidMount() {
      console.log("component did mount");

      this.setAdminCollections();
   }

   componentDidUpdate(prevProps) {
      if (this.props.allCollections !== prevProps.allCollections) {
         this.setState({
            displayedCollections: this.props.allCollections,
         });
      }
   }

   setAdminCollections() {
      axios
         .get("/api/v1/adminAllCollections")
         .then((res) => {
            // handle success
            // console.log("test", res.data);
            this.props.dispatch({
               type: actions.STORE_ALL_COLLECTIONS,
               payload: res.data,
            });
         })
         .catch((error) => {
            // handle error
            console.log(error);
         });
   }

   deleteCollection(collection) {
      // console.log("inside delete function");
      const deletedCollection = collection;
      // console.log(" deletedCollection", deletedCollection);
      const collections = this.state.displayedCollections;
      // console.log("collection", collection);
      const filteredCollections = without(collections, deletedCollection);
      // console.log("filteredCollections", filteredCollections);
      //
      this.setState({
         displayedCollections: filteredCollections,
      });
      // console.log("collection", collection);
      // console.log("filtered tags", filteredTags);
   }

   render() {
      // const collection = this.props.allCollections;
      return (
         <AppTemplate>
            <div className="row">
               <div className="col mt-6 mb-n2">
                  <Link
                     to="/admin-add-photo-collection"
                     className="collection-link"
                  >
                     <img
                        src={AddIcon}
                        width="20px"
                        className="mb-1 primary"
                        alt=""
                     />
                     Add a new collection
                  </Link>
               </div>
            </div>

            {/* <div className="row"> */}
            {this.state.displayedCollections.map((collection) => {
               return (
                  <AdminCollectionUI
                     collection={collection}
                     key={collection.id}
                     deleteCollection={this.deleteCollection}
                  />
               );
            })}
            {/* </div> */}
         </AppTemplate>
      );
   }
}
function mapStateToProps(state) {
   return {
      allCollections: state.allCollections,
      displayedCollections: state.displayedCollections,
   };
}

export default connect(mapStateToProps)(AdminCollections);
