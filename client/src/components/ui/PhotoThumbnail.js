import React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import actions from "../../store/actions";

function PhotoThumbnail(props) {
  // console.log("the props we passed from the parent component:", props.photo);
  function goToPhoto() {
    // console.log("Going to photo");
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
          <img
            className="img-thumbnail"
            src={props.photo.url}
            alt=""
            key={props.photo.id}
          />
        </div>
      </Link>
    </div>
  );
}
function mapStateToProps(state) {
  return {};
}

export default withRouter(connect(mapStateToProps)(PhotoThumbnail));
