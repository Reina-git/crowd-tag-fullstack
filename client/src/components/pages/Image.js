import React from "react";
import AppTemplate from "../ui/AppTemplate";
import BackArrow from "../../icons/icon-arrow-thick-left-circle.svg";
import { Link } from "react-router-dom";
// import LeftChevron from "../../icons/icon-cheveron-down.svg";
import Tag from "../ui/Tag";
import classnames from "classnames";
import { checkIsOver, MAX_CARD_CHARS } from "../../utils/helpers";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import without from "lodash/without";
import axios from "axios";
import { v4 as getUuid } from "uuid";
import jwtDecode from "jwt-decode";
// import actions from "../../store/actions";

class Image extends React.Component {
   constructor(props) {
      super(props);
      // const allTags = this.props.selectedPhoto.photo.tags;
      // console.log("looking for current user ID", this.props.currentUser.id);
      this.state = {
         tagText: "",
         displayedTags: [],
         // displayedTags: allTags,
         isLoggedIn: false,
         photo: this.props.selectedPhoto.photo,
         authToken: localStorage.authToken,
      };
      this.deleteTag = this.deleteTag.bind(this);
      this.setTagText = this.setTagText.bind(this);
      this.addTag = this.addTag.bind(this);
   }

   deleteTag(tag) {
      const deletedTag = tag;
      const tags = this.state.displayedTags;
      const filteredTags = without(tags, deletedTag);
      console.log("looking for tag id", deletedTag.xrefId);
      axios
         .delete(`/api/v1/tags/${deletedTag.xrefId}`)
         .then((res) => {
            console.log(res.data);
            this.setState({
               displayedTags: filteredTags,
            });
            this.props.history.push("/image");
         })
         .catch((err) => {
            console.log(err.response.data);
         });

      // this.setState({
      //    displayedTags: filteredTags,
      // });
      // this.props.history.push("/image");
      // console.log("tag", filteredTags);
      // console.log("filtered tags", filteredTags);
   }

   addTag(e) {
      if (!this.checkHasInvalidCharCount()) {
         if (e.keyCode === 13) {
            const newTagObject = {
               id: getUuid(),
               name: document.getElementById("tagText").value,
               xref_id: getUuid(),
               photo_id: this.props.selectedPhoto.photo.id,
               user_id: this.props.currentUser.id,
            };

            axios
               .post("/api/v1/tags", newTagObject)
               .then((res) => {
                  console.log("posting in tags", res);
               })
               .catch((err) => {
                  console.log(err);
               });

            const copyOfDisplayedTags = [...this.state.displayedTags];
            const updatedDisplayedTags = copyOfDisplayedTags.concat(
               newTagObject
            );
            this.setState({
               displayedTags: updatedDisplayedTags,
            });
            this.setState({ tagText: "" });
            console.log("newTagObject", newTagObject);
            // console.log("xref object", newXrefObject);
         }
      }
   }

   checkHasInvalidCharCount() {
      if (
         this.state.tagText.length > MAX_CARD_CHARS ||
         this.state.tagText.length === 0
      ) {
         return true;
      } else return false;
   }

   componentDidMount() {
      this.getTags();
      this.showLogInTagInput();
   }

   getTags() {
      axios
         .get(
            `/api/v1/tags?photoIdFromCollection=${this.props.selectedPhoto.photo.id}`
         )
         .then((res) => {
            // handle success
            // console.log("test in getTags", res.data);
            this.setState({
               displayedTags: res.data,
            });
         })
         .catch((error) => {
            // handle error
            console.log(error);
         });
   }

   setTagText(e) {
      this.setState({ tagText: e.target.value });
   }

   backToCollection() {
      // console.log("back to collections", this.props.selectedPhoto.prevRoute);
      if (this.props.selectedPhoto.prevRoute === "/collection") {
         this.props.history.push("/collection");
      }
      if (
         this.props.selectedPhoto.prevRoute === "/admin-add-photo-collection"
      ) {
         this.props.history.push("/admin-add-photo-collection");
      }
   }

   showLogInTagInput() {
      const authToken = localStorage.authToken;
      // console.log(authToken);
      if (authToken) {
         const currentTimeInSec = Date.now() / 1000;
         const user = jwtDecode(authToken);
         if (currentTimeInSec > user.exp) {
            // console.log("expiredToken");
            this.setState({
               isLoggedIn: false,
            });
         } else {
            this.setState({
               isLoggedIn: true,
            });
            // console.log("valid token", this.state.isLoggedIn);
         }
      } else {
         // console.log("no token on image page", this.state.isLoggedIn);
         this.setState({
            isLoggedIn: false,
         });
      }
   }

   render() {
      const photo = this.props.selectedPhoto.photo;
      return (
         <AppTemplate>
            <div className="row">
               <div className="col mt-6 mb-n2">
                  <button
                     className="btn btn-link"
                     onClick={() => {
                        this.backToCollection();
                     }}
                  >
                     <img
                        src={BackArrow}
                        width="20px"
                        className="mb-1 primary"
                        alt=""
                     />
                     Back to collection
                  </button>
               </div>
            </div>
            {/* <!-- Main Image--> */}

            <div className="row">
               <div className="d-flex justify-content-center mt-5">
                  {/* TODO add functionality to toggle to previous and next photos */}

                  {/* <div className="col-2 col-md-1 align-self-center">
                  
                     <img
                        src={LeftChevron}
                        width="100%"
                        id="rotate-left"
                        alt="left chevron"
                     />
                  </div> */}
                  <div className="col-12 col-md-12">
                     <div>
                        <img
                           src={photo.url}
                           className="img-fluid"
                           alt=""
                           key={photo.id}
                        />
                     </div>
                  </div>

                  {/* <div className="col-2 col-md-1 align-self-center">
                     <img
                        src={LeftChevron}
                        width="100%"
                        id="rotate-right"
                        alt="right chevron"
                     />
                  </div> */}
               </div>
            </div>
            {/* <!-- Login--> */}

            {/* TODO add route for login so once logged in it will redirect back to this page */}
            {!this.state.isLoggedIn && (
               <>
                  <div className="row">
                     <div className="col-12 mt-5">
                        <p className="text-pimary">
                           Please log in to begin tagging photos.
                        </p>
                        <Link to="/log-in" className="btn btn-primary">
                           Log in
                        </Link>
                     </div>
                  </div>
               </>
            )}
            {/* need to be logged in for this section */}
            {this.state.isLoggedIn && (
               <>
                  <div className="row">
                     <div className="col-12 mt-5">
                        <p className="text-primary">
                           Type a tag then press enter.
                        </p>
                        <input
                           className="form-control form-control-sm mt-3"
                           // ref="tagInput"
                           type="text"
                           placeholder="Add a tag"
                           id="tagText"
                           value={this.state.tagText}
                           onKeyDown={this.addTag}
                           onChange={(e) => this.setTagText(e)}
                        />
                     </div>
                  </div>
                  <p className="float-right mt-2 mb-0 text-muted">
                     <span
                        className={classnames({
                           "text-danger": checkIsOver(
                              this.state.tagText,
                              MAX_CARD_CHARS
                           ),
                        })}
                     >
                        {this.state.tagText.length}/{MAX_CARD_CHARS}
                     </span>
                  </p>

                  <div className="row">
                     <div className="col-12">
                        <div className="clearfix"></div>

                        {this.state.displayedTags.map((tag) => {
                           return (
                              <Tag
                                 tag={tag}
                                 key={tag.id}
                                 deleteTag={this.deleteTag}
                              />
                           );
                        })}
                     </div>
                  </div>
               </>
            )}
            {/* end of tag sections */}
         </AppTemplate>
      );
   }
}
function mapStateToProps(state) {
   return {
      currentUser: state.currentUser,
      selectedPhoto: state.selectedPhoto,
      // displayedTag: state.displayedTag,
   };
}

export default withRouter(connect(mapStateToProps)(Image));
