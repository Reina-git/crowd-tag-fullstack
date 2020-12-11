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
import actions from "../../store/actions";
import without from "lodash/without";
import ReactDOM from "react-dom";

class Image extends React.Component {
  constructor(props) {
    super(props);
    const allTags = this.props.photo.tags;
    this.state = {
      tagText: "",
      displayedTags: allTags,
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

  // addTag(e) {
  //   if (e.keyCode === 13) {
  //     const addNewTag = e.target.value;
  //     console.log(addNewTag);
  //     this.setState({ tagText: addNewTag });
  //   }
  // }

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

  // setTagsDisplay() {
  //   const copyOfDisplayedTags = [...this.state.displayedTags];
  // }

  render() {
    // console.log("props on image page", this.props.photo);
    const photo = this.props.photo;

    return (
      <AppTemplate>
        <div className="row">
          <div className="col mt-6 mb-n2">
            <Link to="/collection" className="collection-link">
              <img
                src={BackArrow}
                width="20px"
                className="mb-1 primary"
                alt=""
              />
              Back to collection
            </Link>
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
              // onChange={this.setTagText}
              onChange={(e) => this.setTagText(e)}
            />
          </div>
        </div>
        <p className="float-right mt-2 mb-0 text-muted">
          <span
            className={classnames({
              "text-danger": checkIsOver(this.state.tagText, MAX_CARD_CHARS),
            })}
          >
            {this.state.tagText.length}/{MAX_CARD_CHARS}
          </span>
        </p>

        <div className="row">
          <div className="col-12">
            <div className="clearfix"></div>

            {this.state.displayedTags.map((tag) => {
              return <Tag tag={tag} key={tag.id} deleteTag={this.deleteTag} />;
            })}
          </div>
        </div>
      </AppTemplate>
    );
  }
}
function mapStateToProps(state) {
  return {
    photo: state.selectedPhoto,
    displayedTag: state.displayedTag,
  };
}

export default withRouter(connect(mapStateToProps)(Image));
