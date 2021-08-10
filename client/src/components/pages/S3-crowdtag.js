import React from "react";
import AppTemplate from "../ui/AppTemplate";
import { Link } from "react-router-dom";

import BackArrow from "../../icons/icon-arrow-thick-left-circle.svg";
import AdminPhotoThumbnail from "../ui/AdminPhotoThumbnail";
import Save from "../../icons/save.svg";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import without from "lodash/without";
import actions from "../../store/actions";
import { v4 as getUuid } from "uuid";
import axios from "axios";

class S3 extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         isDisplayingAddPhoto: false,
         isDisplayingDelete: false,
         displayedPhotos: [],
         collectionTitle: this.props.collection.name,
         photoUrl: "",
         newCollection: {},
         photoUploadText: "Choose a file",
         photoUploadFile: {},
      };
      this.deletePhoto = this.deletePhoto.bind(this);
      this.setPhotoUrlText = this.setPhotoUrlText.bind(this);
   }

   componentDidMount() {
      this.setCollection();
   }

   // setPhotoUploadText(e) {
   //    const text = e.target.value;
   //    this.setState({ photoUploadText: text });
   // }

   setPhotoUploadDetails(e) {
      const file = e.target.files[0];
      if (file) {
         this.setState({
            photoUploadText: file.name,
            photoUploadFile: file,
         });
      } else {
         this.setState({
            photoUploadText: "Choose a file",
            photoUploadFile: {},
         });
      }
   }

   setCollection() {
      console.log("set collection");
      if (this.props.collection.id === undefined) {
         const newCollectionPlaceholder = {
            createdAt: Date.now(),
            id: getUuid(),
            institutionName: "",
            name: "",
            photos: [],
            userId: this.props.currentUser.institutionName,
         };
         console.log("new collection", newCollectionPlaceholder);
         this.setState({
            newCollection: newCollectionPlaceholder,
         });
      } else {
         console.log("there is a collection", this.props.collection.photos);
         const allPhotos = this.props.collection.photos;
         this.setState({
            displayedPhotos: allPhotos,
         });
      }
   }

   setCollectionTitleText(e) {
      this.setState({ collectionTitle: e.target.value });
   }

   showDelete() {
      this.setState({
         isDisplayingDelete: !this.state.isDisplayingDelete,
      });
   }
   showInputs() {
      this.setState({
         isDisplayingAddPhoto: !this.state.isDisplayingAddPhoto,
      });
   }

   setPhotoUrlState() {
      const photoUrl = document.getElementById("addPhotoInput").value;

      this.setState({
         photoUrl: photoUrl,
      });
   }

   checkHasInvalidCharCount() {
      if (
         this.state.photoUrl.length > 2000 ||
         this.state.photoUrl.length === 0
      ) {
         return true;
      } else return false;
   }

   setPhotoUrlText(e) {
      this.setState({ photoUrl: e.target.value });
      // console.log("text input", e.target.value);
   }

   getPhotoName() {
      const url = document.getElementById("addPhotoInput").value;
      const splitUrl = url.split("/");
      const reverseSplitUrl = splitUrl.reverse();
      const photoName = reverseSplitUrl[0];
      return photoName;
   }

   backToCollections() {
      this.props.dispatch({
         type: actions.STORE_SELECTED_COLLECTION,
         payload: [],
      });

      this.props.history.push("/admin-collections");
   }

   addPhoto(e) {
      e.preventDefault();
      const formData = new FormData();
      formData.append("added-photo", this.state.photoUploadFile);
      if (!this.checkHasInvalidCharCount()) {
         this.setPhotoUrlState();
         console.log("displayedPhotos", this.state.displayedPhotos);
         if (this.state.displayedPhotos.length <= 0) {
            const newPhotoObject = {
               id: getUuid(),
               collectionID: this.state.newCollection.id,
               uploadedAt: this.state.newCollection.createdAt,
               fileName: this.getPhotoName(),
               url: document.getElementById("addPhotoInput").value,
               dbAction: "add",
               tags: [],
            };

            this.setState({
               displayedPhotos: [newPhotoObject],
            });
            this.setState({ photoUrl: "" });
            this.props.dispatch({
               type: actions.STORE_SELECTED_COLLECTION,
               payload: [newPhotoObject],
            });
            console.log("newPhotoObject", newPhotoObject);
         } else {
            console.log("not a new photo");
            const addedPhotoObject = {
               id: getUuid(),
               collectionID: this.state.displayedPhotos[0].collectionID,
               uploadedAt: Date.now(),
               fileName: this.getPhotoName(),
               url: document.getElementById("addPhotoInput").value,
               dbAction: "add",
               tags: [],
            };
            const copyOfDisplayedPhotos = [...this.state.displayedPhotos];
            const updatedDisplayedPhotos = copyOfDisplayedPhotos.concat(
               addedPhotoObject
            );
            this.setState({
               displayedPhotos: updatedDisplayedPhotos,
            });

            this.setState({ photoUrl: "" });

            console.log("added to existing collection", addedPhotoObject);
         }
      }
   }

   deletePhoto(photo) {
      const deletePhoto = photo;
      const photos = this.state.displayedPhotos;
      const filteredPhotos = without(photos, deletePhoto);
      this.setState({
         displayedPhotos: filteredPhotos,
      });

      axios
         .delete(`/api/v1/photos/${deletePhoto.id}`)
         .then((res) => {
            console.log(res.data);
            this.setState({
               displayedPhotos: filteredPhotos,
            });
         })
         .catch((err) => {
            console.log(err.response.data);
         });
   }

   deleteCollection(collection) {
      const deleteCollection = collection;
      console.log("delete this collection", deleteCollection);
   }

   saveCollection() {
      const newCollection = {
         id: this.state.newCollection.id,
         name: this.state.collectionTitle,
         userId: this.props.currentUser.id,
         createdAt: this.state.newCollection.createdAt,
         institutionName: this.props.currentUser.institutionName,
         photos: this.state.displayedPhotos,
      };

      const updatedCollection = {
         id: this.props.collection.id,
         name: this.state.collectionTitle,
         userId: this.props.collection.userId,
         createdAt: this.props.collection.createdAt,
         institutionName: this.props.collection.institutionName,
         photos: this.state.displayedPhotos,
      };
      // console.log(this.props.collection.id);
      if (updatedCollection.id === undefined) {
         // console.log("this is a new collection");
         console.log("new collection", newCollection);
         console.log("photos", this.state.displayedPhotos);
         axios
            .post("/api/v1/adminAllCollections", newCollection)
            .then((res) => {
               console.log("posting new collection", res);
            })
            .catch((err) => {
               console.log(err);
            });
      } else {
         console.log("this collection needs to be updated");
         console.log("updated collection", updatedCollection);
         axios
            .put("/api/v1/adminAllCollections", updatedCollection)
            .then((res) => {
               console.log("posting updated collection", res);
            })
            .catch((err) => {
               console.log(err);
            });
      }
      this.props.history.push("/admin-collections");
   }

   render() {
      return (
         <AppTemplate>
            <h1>S3 Demo</h1>
            <div className="row">
               <div className="col mt-6 mb-0">
                  <button
                     className="collection-link btn btn-link"
                     onClick={() => {
                        this.backToCollections();
                     }}
                  >
                     <img
                        src={BackArrow}
                        width="15px"
                        className="mb-1 primary"
                        alt=""
                     />
                     Back to collections
                  </button>
               </div>
            </div>
            <form
               onSubmit={(e) => {
                  this.addPhoto(e);
               }}
            >
               <div className="formgroup">
                  <div className="row">
                     <div className="col mt-4 mb-0">
                        <input
                           className="form-control d-inline"
                           defaultValue={this.props.collection.name}
                           onChange={(e) => this.setCollectionTitleText(e)}
                           id="collectionTitle"
                           placeholder="Collection Title"
                        />
                     </div>
                  </div>
                  <div className="row my-4 ml-1">
                     <div className="col-8">
                        <div className="custon-file">
                           <input
                              type="file"
                              class="custom-file-input"
                              id="photoUpload"
                              onChange={(e) => {
                                 this.setPhotoUploadDetails(e);
                              }}
                           />
                           <label
                              className="custom-file-label"
                              htmlFor="photoUpload"
                           >
                              {this.state.photoUploadText}
                           </label>
                        </div>
                     </div>
                     <div className="col-4">
                        <button
                           className="btn btn-primary btn-block btn-sm"
                           type="submit"
                        >
                           Add Photo
                        </button>
                     </div>
                  </div>
               </div>
            </form>

            {/* <!-- Collection Name --> */}
            <hr className="mt-2 mb-5" />

            <div className="row">
               {this.state.displayedPhotos &&
                  this.state.displayedPhotos.map((photo) => {
                     return (
                        <AdminPhotoThumbnail
                           photo={photo}
                           key={photo.id}
                           deletePhoto={this.deletePhoto}
                        />
                     );
                  })}
            </div>
            <div className="custom-control custom-checkbox">
               <input
                  type="checkbox"
                  className="custom-control-input"
                  id="showDelete"
                  name="showDelete"
                  value={!this.state.isDisplayingDelete}
                  onChange={() => {
                     this.showDelete();
                  }}
               />
               <label className="custom-control-label" htmlFor={"showDelete"}>
                  Show delete button
               </label>
            </div>
            <div className="float-right mt-n5">
               <Link to="" className="btn btn-outline-primary">
                  Cancel
               </Link>

               <button
                  className="btn btn-primary ml-4"
                  onClick={() => {
                     this.saveCollection();
                  }}
               >
                  <img
                     src={Save}
                     width="20px"
                     style={{ marginBottom: "5px", marginRight: "4px" }}
                     alt=""
                  />
                  Save
               </button>
            </div>
            <div className="mt-4 mb-3">
               {this.state.isDisplayingDelete && (
                  <>
                     <button
                        className="btn btn-outline-danger"
                        id="delete-button"
                        onClick={() => {
                           this.deleteCollection();
                        }}
                     >
                        Delete collection
                     </button>
                  </>
               )}
            </div>
         </AppTemplate>
      );
   }
}
function mapStateToProps(state) {
   return {
      collection: state.selectedCollection,
      allCollections: state.allCollections,
      currentUser: state.currentUser,
   };
}

export default withRouter(connect(mapStateToProps)(S3));
