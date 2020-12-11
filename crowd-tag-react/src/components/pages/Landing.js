import React from "react";
import AppTemplate from "../ui/AppTemplate";
import CollectionUI from "../ui/CollectionUI";
import axios from "axios";
import orderBy from "lodash/orderBy";
import { connect } from "react-redux";
// import actions from "../../store/actions";

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: '[["createdAt"], ["desc"]]',
      displayedCollections: [],
      allCollections: [],
    };
  }

  componentDidMount() {
    axios
      .get(
        "https://raw.githubusercontent.com/Reina-git/Crowd-Tag-React/main/src/mock-data/nested-collections.json"
      )
      .then((res) => {
        // handle success
        console.log(res.data);
        const collections = res.data;
        this.setState({
          displayedCollections: orderBy(collections, ["createdAt"], ["desc"]),
          allCollections: orderBy(collections, ["createdAt"], ["desc"]),
        });
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  }

  filterByInput() {
    const input = document.getElementById("search-input").value;
    const lowerCasedInput = input.toLowerCase();
    console.log(lowerCasedInput);
    const copyOfAllCollections = [...this.state.allCollections];
    console.log("copy of all collections", copyOfAllCollections);
    // console.log("all collections", this.state.allCollections);
    const filteredCollections = copyOfAllCollections.filter((collection) => {
      const lowerCasedCollectionName = collection.name.toLowerCase();
      const lowerCasedInstitutionName = collection.institutionName.toLowerCase();
      if (
        lowerCasedCollectionName.includes(lowerCasedInput) ||
        lowerCasedInstitutionName.includes(lowerCasedInput)
      ) {
        return true;
      }
      return false;
    });
    this.setState({ displayedCollections: filteredCollections }, () => {
      this.setCollections();
    });
  }

  setOrder(e) {
    const newOrder = e.target.value;
    this.setState({ order: newOrder }, () => {
      this.setCollections();
    });
  }

  setCollections() {
    const copyOfDisplayedCollections = [...this.state.displayedCollections];
    const toJson = JSON.parse(this.state.order);
    const orderedCollections = orderBy(copyOfDisplayedCollections, ...toJson);
    // console.log(orderedCollections);
    this.setState({ displayedCollections: orderedCollections });
  }

  render() {
    return (
      <AppTemplate>
        <div className="row my-4">
          <div className="col-8">
            <input
              className=" form-control form-control-sm"
              type="text"
              placeholder="Search for a word"
              id="search-input"
            />
          </div>
          <div className="col-4">
            <button
              className="btn btn-primary btn-block btn-sm"
              onClick={() => this.filterByInput()}
            >
              Search
            </button>
          </div>
        </div>

        <div className="row my-4 no-gutters">
          <div className="col-4">
            <p className="text-muted mt-2">Sort collections by</p>
          </div>
          <div className="col-8">
            <select
              value={this.state.order}
              className="form-control form-control-sm"
              onChange={(e) => this.setOrder(e)}
            >
              <option value='[["createdAt"], ["desc"]]'>Most recent</option>
              <option value='[["createdAt"], ["asc"]]'>Oldest</option>
            </select>
          </div>
        </div>

        {this.state.displayedCollections.map((collection) => {
          return (
            <CollectionUI
              collection={collection}
              name={collection.name}
              institutionName={collection.institutionName}
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
