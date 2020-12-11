import React from "react";
import { Link, withRouter } from "react-router-dom";
import TrashIcon from "../../icons/icon-trash.svg";
import { connect } from "react-redux";
import actions from "../../store/actions";
import without from "lodash/without";

function AdminPhotoThumbnail(props) {
  console.log("adminPhotoThumbnail", props);
  function goToPhoto() {
    console.log("Going to photo");
    props.dispatch({
      type: actions.STORE_SELECTED_PHOTO,
      payload: props.photo,
    });
    props.history.push("/image");
  }

  return (
    <div className="col-lg-3 col-md-4 col-6 mb-5">
      <Link to="/image">
        <div
          className="img-square"
          onClick={() => {
            goToPhoto();
          }}
        >
          <img className="img-thumbnail" src={props.photo.url} alt="" />
        </div>

        <p className="file-name-text text-break ml-1">{props.photo.fileName}</p>
      </Link>
      <button
        to=""
        className="remove-link tag-text-remove btn ml-n5"
        onClick={() => {
          props.deletePhoto(props.photo);
        }}
      >
        <img className="mt-n1" src={TrashIcon} alt="" width="15px" />
        Remove
      </button>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    collection: state.selectedCollection,
  };
}

export default withRouter(connect(mapStateToProps)(AdminPhotoThumbnail));
