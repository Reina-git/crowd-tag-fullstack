import React from "react";
import { Link, withRouter } from "react-router-dom";
import TrashIcon from "../../icons/icon-trash.svg";
import toDisplayDate from "date-fns/format";
import { connect } from "react-redux";
import actions from "../../store/actions";

function AdminCollectionUI(props) {
  function goToCollection() {
    props.dispatch({
      type: actions.STORE_SELECTED_COLLECTION,
      payload: props.collection,
    });
    props.history.push("/admin-add-photo-collection");
  }
  return (
    <div className="row mt-6">
      <div
        className="col-12 col-sm-4"
        onClick={() => {
          goToCollection();
        }}
      >
        <div className="img-square">
          <img
            src={props.collection.photos[0].url}
            alt="..."
            className="img-thumbnail"
          />
        </div>
      </div>
      <div
        className="col-6"
        onClick={() => {
          goToCollection();
        }}
      >
        <p className="collection-link stretched-link"></p>

        <p className="lead">{props.collection.name}</p>

        <p className="text-muted">{props.collection.institutionName}</p>
        <p className="text-muted mt-2">
          {toDisplayDate(props.collection.createdAt, "MMM. d, yyy")}
        </p>
      </div>
      <div className="col-6 col-sm-2">
        <button
          to=""
          className="remove-link float-right btn"
          onClick={() => {
            console.log("clicked");
            props.deleteCollection(props.collection);
          }}
        >
          <img className="" src={TrashIcon} alt="" width="20px" />
          Remove
        </button>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    // collection: state.selectedCollection,
  };
}

export default withRouter(connect(mapStateToProps)(AdminCollectionUI));
