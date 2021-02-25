import React from "react";
import AppTemplate from "../ui/AppTemplate";
import { Link } from "react-router-dom";
import AddIcon from "../../icons/icon-add.svg";
import BackArrow from "../../icons/icon-arrow-thick-left-circle.svg";
import AdminPhotoThumbnail from "../ui/AdminPhotoThumbnail";
import Save from "../../icons/save.svg";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import without from "lodash/without";
import actions from "../../store/actions";
import { v4 as getUuid } from "uuid";
import axios from "axios";

class AdminAddPhotoCollection extends React.Component {
   constructor(props) {
      super(props);
      // console.log("props", props.collection.photos);
      // const allPhotos = this.props.collection.photos;
      this.state = {
         isDisplayingAddPhoto: false,
         isDisplayingDelete: false,
         displayedPhotos: [],
         collectionTitle: this.props.collection.name,
         photoUrl: "",
         newCollection: {},
      };
      this.deletePhoto = this.deletePhoto.bind(this);
      this.setPhotoUrlText = this.setPhotoUrlText.bind(this);
   }

   componentDidMount() {
      this.setCollection();
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

   addPhoto() {
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
      const deletePhotoFromDisplay = photo;
      // console.log("index of deleted photo", this.props.collection.photos);
      const photos = this.state.displayedPhotos;
      const filteredPhotos = without(photos, deletePhotoFromDisplay);
      // console.log("filteredPhotos", filteredPhotos);
      this.setState({
         displayedPhotos: filteredPhotos,
      });

      // replace old photo with deleted photo
      // find index of where the og photo is
      // replace the object at that index
      // now we have the new array and set the state with the new array

      const deletePhotoFromServer = {
         ...photo,
         dbAction: "remove",
      };
      // const deletedPhotoId = deletePhotoFromServer.id;
      // const deletedPhotoIndex = photos.map((photo) => {
      //    const photosFromProps = this.props.collection.photos;
      //    console.log("all photos", photosFromProps);
      //    const photoIdIndex = photosFromProps.findIndex((deletedPhotoId) => {});
      //    return photoIdIndex;
      // });
      // console.log(deletedPhotoIndex);
      // use find index

      // const deletePhotoIndex = photosFromProps.findIndex((id) => {
      //    return indexOf(deletedPhotoId);
      // });
      // console.log(deletePhotoIndex);
      const photosFromProps = this.props.collection.photos;
      const deletedPhotoId = deletePhotoFromServer.id;
      for (let i = 0; i < photosFromProps.length; i++) {
         const photoId = photosFromProps[i].id;
         if (photoId === deletedPhotoId) {
            const index = i;
            console.log("index", index);
         }
      }
   }

   deleteCollection() {
      console.log(this.props.allCollections);
      const deletedCollection = this.props.collection;
      const allCollections = this.props.allCollections;
      const filteredCollections = without(allCollections, deletedCollection);
      // console.log(filteredCards);
      this.props.dispatch({
         type: actions.STORE_ALL_COLLECTIONS,
         payload: filteredCollections,
      });
      // if (filteredCards[this.props.queue.index] === undefined) {
      this.props.history.push("/admin-collections");
      // } else {
      //    this.props.history.push("/review-imagery");
      // }
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

            <div className="row">
               <div className="col mt-4 mb-0">
                  <input
                     className="form-control d-inline"
                     defaultValue={this.props.collection.name}
                     onChange={(e) => this.setCollectionTitleText(e)}
                     id="collectionTitle"
                  />

                  <button
                     className="text-primary btn btn-link float-right"
                     id="add-photo-btn"
                     // checked={this.state.isDisplayingAddPhoto}
                     // value={!this.state.isDisplayingAddPhoto}
                     onClick={() => {
                        this.showInputs();
                     }}
                  >
                     <img
                        src={AddIcon}
                        width="20px"
                        className="mb-1 primary"
                        alt=""
                     />
                     Add photos
                  </button>
               </div>
            </div>
            {this.state.isDisplayingAddPhoto && (
               <>
                  <div className="row my-4">
                     <div className="col-8">
                        <input
                           className="form-control form-control-sm"
                           type="text"
                           placeholder="Add photo url"
                           id="addPhotoInput"
                           value={this.state.photoUrl}
                           // onChange={this.state.photoUrl}
                           onChange={(e) => this.setPhotoUrlText(e)}
                        />
                     </div>
                     <div className="col-4">
                        <button
                           className="btn btn-primary btn-block btn-sm"
                           onClick={() => this.addPhoto()}
                        >
                           Add Photo
                        </button>
                     </div>
                  </div>
               </>
            )}

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

export default withRouter(connect(mapStateToProps)(AdminAddPhotoCollection));
