import React from "react";
import AppTemplate from "../ui/AppTemplate";
import BackArrow from "../../icons/icon-arrow-thick-left-circle.svg";
import { Link } from "react-router-dom";
import LeftChevron from "../../icons/icon-cheveron-down.svg";
import Tag from "../ui/Tag";
import classnames from "classnames";
import { checkIsOver, MAX_CARD_CHARS } from "../../utils/helpers";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import without from "lodash/without";

class Image extends React.Component {
   constructor(props) {
      super(props);
      const allTags = this.props.selectedPhoto.photo.tags;
      this.state = {
         tagText: "",
         displayedTags: allTags,
         isLoggedIn: "",
         photo: this.props.selectedPhoto.photo,
      };
      this.deleteTag = this.deleteTag.bind(this);
      this.setTagText = this.setTagText.bind(this);
      this.addTag = this.addTag.bind(this);
   }

   deleteTag(tag) {
      const deletedTag = tag;
      const tags = this.state.displayedTags;
      const filteredTags = without(tags, deletedTag);
      //
      this.setState({
         displayedTags: filteredTags,
      });
      this.props.history.push("/image");
      console.log("tag", filteredTags);
      // console.log("filtered tags", filteredTags);
   }

   addTag(e) {
      if (e.keyCode === 13) {
         let newTagObject = {
            id: Date.now(),
            name: "",
            userId: "",
         };
         newTagObject.name = document.getElementById("tagText").value;
         const copyOfDisplayedTags = [...this.state.displayedTags];
         const updatedDisplayedTags = copyOfDisplayedTags.concat(newTagObject);
         this.setState({
            displayedTags: updatedDisplayedTags,
         });
         this.setState({ tagText: "" });
         console.log(newTagObject);
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

   setTagText(e) {
      this.setState({ tagText: e.target.value });
   }

   backToCollection() {
      console.log("back to collections", this.props.selectedPhoto.prevRoute);
      if (this.props.selectedPhoto.prevRoute === "/collection") {
         this.props.history.push("/collection");
      }
      if (
         this.props.selectedPhoto.prevRoute === "/admin-add-photo-collection"
      ) {
         this.props.history.push("/admin-add-photo-collection");
      }
   }

   render() {
      // console.log("props on image page", this.props.photo);
      const photo = this.props.selectedPhoto.photo;
      console.log("photo", photo);

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
                  <div className="col-2 col-md-1 align-self-center">
                     <img
                        src={LeftChevron}
                        width="100%"
                        id="rotate-left"
                        alt="left chevron"
                     />
                  </div>
                  <div className="col-8 col-md-10">
                     <div>
                        <img
                           src={photo.url}
                           className="img-fluid"
                           alt=""
                           key={photo.id}
                        />
                     </div>
                  </div>

                  <div className="col-2 col-md-1 align-self-center">
                     <img
                        src={LeftChevron}
                        width="100%"
                        id="rotate-right"
                        alt="right chevron"
                     />
                  </div>
               </div>
            </div>
            {/* <!-- Input--> */}
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
            <div className="row">
               <div className="col-12 mt-5">
                  <p className="text-primary">Type a tag then press enter.</p>
                  <input
                     className="form-control form-control-sm mt-3"
                     ref="tagInput"
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
         </AppTemplate>
      );
   }
}
function mapStateToProps(state) {
   return {
      selectedPhoto: state.selectedPhoto,
      displayedTag: state.displayedTag,
   };
}

export default withRouter(connect(mapStateToProps)(Image));
