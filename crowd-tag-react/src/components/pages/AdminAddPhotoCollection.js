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

class AdminAddPhotoCollection extends React.Component {
  constructor(props) {
    super(props);
    // console.log("props", props.collection.photos);
    const allPhotos = this.props.collection.photos;
    this.state = {
      isDisplayingAddPhoto: false,
      isDisplayingDelete: false,
      displayedPhotos: allPhotos,
    };
    this.deletePhoto = this.deletePhoto.bind(this);
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
  deletePhoto(photo) {
    const deletedPhoto = photo;
    const photos = this.state.displayedPhotos;
    const filteredPhotos = without(photos, deletedPhoto);
    console.log("filteredPhotos", filteredPhotos);
    //
    this.setState({
      displayedPhotos: filteredPhotos,
    });
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

  render() {
    return (
      <AppTemplate>
        <div className="row">
          <div className="col mt-6 mb-0">
            <Link to="/admin-collections" className="collection-link">
              <img
                src={BackArrow}
                width="15px"
                className="mb-1 primary"
                alt=""
              />
              Back to collections
            </Link>
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
              <img src={AddIcon} width="20px" className="mb-1 primary" alt="" />
              Add photos
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            {this.state.isDisplayingAddPhoto && (
              <>
                <div id="photo-url">
                  <input
                    className="form-control form-control-sm mt-3"
                    type="text"
                    placeholder="Add photo url"
                  />
                </div>
              </>
            )}
          </div>
        </div>
        {/* <!-- Collection Name --> */}
        <hr className="mt-2 mb-5" />

        <div className="row">
          {this.state.displayedPhotos.map((photo) => {
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
          <Link to="" className="btn btn-primary ml-4">
            <img
              src={Save}
              width="20px"
              style={{ marginBottom: "5px", marginRight: "4px" }}
              alt=""
            />
            Save
          </Link>
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
  };
}

export default withRouter(connect(mapStateToProps)(AdminAddPhotoCollection));
