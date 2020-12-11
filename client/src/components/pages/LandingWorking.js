import React from "react";
import AppTemplate from "../ui/AppTemplate";
import CollectionUI from "../ui/CollectionUI";
import axios from "axios";
// import orderBy from "lodash/orderBy";
import { connect } from "react-redux";
import actions from "../../store/actions";

class Landing extends React.Component {
  constructor(props) {
    super(props);
    axios
      .get(
        "https://raw.githubusercontent.com/Reina-git/Crowd-Tag-React/main/src/mock-data/nested-collections.json"
      )
      .then((res) => {
        // handle success
        // console.log("test", res.data);
        props.dispatch({
          type: actions.STORE_ALL_COLLECTIONS,
          payload: res.data,
        });
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  }

  // goToCollection() {
  //   this.props.dispatch({ type: actions.STORE_SELECTED_COLLECTION_INDEX });
  // }

  render() {
    const collection = this.props.allCollections;

    // console.log("collection", this.props);
    return (
      <AppTemplate>
        {collection.map((collection) => {
          return (
            <CollectionUI
              collection={collection}
              // name={collection.name}
              // institutionName={collection.institutionName}
              key={collection.id}
            />
          );
        })}
      </AppTemplate>
    );
  }
}
function mapStateToProps(state) {
  return {
    allCollections: state.allCollections,
  };
}

export default connect(mapStateToProps)(Landing);
