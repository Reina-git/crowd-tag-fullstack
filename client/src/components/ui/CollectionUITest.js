import React from "react";
import { Link } from "react-router-dom";
import toDisplayDate from "date-fns/format";

export default class CollectionUITest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDisplayingAddPhoto: false,
      isDisplayingDelete: false,
      collectionTitle: collection.name,
    };
  }
  render() {
    return (
      <div className="row mt-8">
        <div className="col-12 col-sm-4">
          <div className="img-square">
            <Link to="/collection">
              <img
                src={props.collection.photos[0].url}
                alt="..."
                className="img-thumbnail thumb-img"
              />
            </Link>
          </div>
        </div>
        <div className="col-8">
          <Link
            to="/collection"
            className="lead collection-link stretched-link"
          >
            {props.collection.name}
          </Link>
          <p className="text-muted">{props.collection.institutionName}</p>
          <p className="text-muted mt-2">
            {toDisplayDate(props.collection.createdAt, "MMM. d, yyy")}
          </p>
        </div>
      </div>
    );
  }
}
