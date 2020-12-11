import React from "react";
import Logo from "../../images/noun_shutter_1063959.svg";
import { Link } from "react-router-dom";
import actions from "../../store/actions";
import { connect } from "react-redux";

class Header extends React.Component {
  constructor(props) {
    super(props);
    // console.log(this.props.user);
    this.state = {
      isLoggedIn: {},
    };
  }

  logOutCurrentUser() {
    this.props.dispatch({
      type: actions.STORE_CURRENT_USER,
      payload: {},
    });
  }

  render() {
    return (
      <div className="row">
        <div className="col-12 mt-6">
          <Link to="/" className="Logo-link">
            <img src={Logo} className="mt-n2 logo" alt="logo" width="30px" />
            <h1 className="d-inline ml-2 font-family-brand" id="logo-text">
              Crowd Tag
            </h1>
          </Link>
          <div className="float-right mt-2">
            <Link to="/log-in" className="collection-link pr-3">
              Log in
            </Link>
            <Link to="/library-log-in" className="collection-link pr-3">
              Library log in
            </Link>
            <Link
              to="/log-in"
              className="collection-link"
              onClick={() => {
                this.logOutCurrentUser();
              }}
            >
              Log out
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {};
}
export default connect(mapStateToProps)(Header);
