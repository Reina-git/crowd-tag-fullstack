import React from "react";
import AppTemplate from "../ui/AppTemplate";
import { Link } from "react-router-dom";
import BackArrow from "../../icons/icon-arrow-thick-left-circle.svg";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PhotoThumbnail from "../ui/PhotoThumbnail";
// const collection = nestedCollections[0];

function Collection(props) {
  // const mapCollection = props.collection;
  return (
    <AppTemplate>
      <div className="row">
        <div className="col mt-6 mb-0">
          <Link to="/" className="collection-link">
            <img
              src={BackArrow}
              width="20px"
              alt="back arrow"
              className="mb-1 primary"
            />
            Back to collections
          </Link>
        </div>
      </div>
      <h2 className="lead mt-4 mb-0">{props.collection.name}</h2>

      <hr className="mt-2 mb-5" />
      <div className="row">
        {props.collection.photos.map((photo) => {
          return <PhotoThumbnail photo={photo} key={photo.id} />;
        })}
      </div>
    </AppTemplate>
  );
}
function mapStateToProps(state) {
  return {
    collection: state.selectedCollection,
  };
}

export default withRouter(connect(mapStateToProps)(Collection));
