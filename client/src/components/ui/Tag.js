import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import RedX from "../../icons/icon-close.svg";

function Tag(props) {
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
