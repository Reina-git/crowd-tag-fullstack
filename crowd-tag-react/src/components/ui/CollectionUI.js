import React from "react";
import { Link, withRouter } from "react-router-dom";
import toDisplayDate from "date-fns/format";
import { connect } from "react-redux";
import actions from "../../store/actions";

function CollectionUI(props) {
  function goToCollection() {
    console.log("Going to collection");
    props.dispatch({
      type: actions.STORE_SELECTED_COLLECTION,
      payload: props.collection,
    });
    props.history.push("/collection");
  }

  return (
    <div
      className="row mt-8"
      onClick={() => {
        goToCollection();
      }}
    >
      <div className="col-12 col-sm-4">
        <div className="img-square">
          <img
            src={props.collection.photos[0].url}
            alt="..."
            className="img-thumbnail thumb-img"
          />
        </div>
      </div>
      <div className="col-8">
        <p className="lead collection-link stretched-link">
          {props.collection.name}
        </p>
        <p className="text-muted">{props.collection.institutionName}</p>
        <p className="text-muted mt-2">
          {toDisplayDate(props.collection.createdAt, "MMM. d, yyy")}
        </p>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {};
}

export default withRouter(connect(mapStateToProps)(CollectionUI));
