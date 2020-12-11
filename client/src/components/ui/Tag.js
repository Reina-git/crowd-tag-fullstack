import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import RedX from "../../icons/icon-close.svg";
import actions from "../../store/actions";
import without from "lodash/without";

function Tag(props) {
  // function deleteTag() {
  //   const deletedTag = props.tag;
  //   const tags = props.photo.tags;
  //   const filteredTags = without(tags, deletedTag);
  //   props.dispatch({
  //     type: actions.STORE_DISPLAY_TAG,
  //     payload: filteredTags,
  //   });
  //   props.history.push("/image");
  //   console.log("filtered tags", filteredTags);
  // }
  return (
    <div className="d-inline-flex">
      <p className="tag-text mt-3">{props.tag.name}</p>
      <button
        to=""
        width="20px"
        className="btn"
        onClick={() => {
          props.deleteTag(props.tag);
        }}
      >
        <img src={RedX} width="20px" alt="delete" className="ml-n3" />
      </button>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    photo: state.selectedPhoto,
  };
}

export default withRouter(connect(mapStateToProps)(Tag));
