import React from "react";
import Logo from "../../images/noun_shutter_1063959.svg";
import { Link } from "react-router-dom";
import actions from "../../store/actions";
import { connect } from "react-redux";
import jwtDecode from "jwt-decode";

class Header extends React.Component {
   constructor(props) {
      super(props);
      // console.log(this.props.user);
      this.state = {
         isLoggedIn: {},
         showLogin: true,
      };
   }

   logOutCurrentUser() {
      this.props.dispatch({
         type: actions.STORE_CURRENT_USER,
         payload: {},
      });
      this.props.dispatch({
         type: actions.STORE_ALL_COLLECTIONS,
         payload: [],
      });
   }

   showLogInTagInput() {
      const authToken = localStorage.authToken;
      // console.log(authToken);
      if (authToken) {
         const currentTimeInSec = Date.now() / 1000;
         const user = jwtDecode(authToken);
         if (currentTimeInSec > user.exp) {
            // console.log("expiredToken");
            this.setState({
               showLogin: false,
            });
         } else {
            this.setState({
               showLogin: true,
            });
            // console.log("valid token", this.state.showLogin);
         }
      } else {
         // console.log("no token on image page", this.state.showLogin);
         this.setState({
            showLogin: false,
         });
      }
   }

   render() {
      return (
         <div className="row">
            <div className="col-12 mt-6">
               <Link to="/" className="Logo-link">
                  <img
                     src={Logo}
                     className="mt-n2 logo"
                     alt="logo"
                     width="30px"
                  />
                  <h1
                     className="d-inline ml-2 font-family-brand"
                     id="logo-text"
                  >
                     Crowd Tag
                  </h1>
               </Link>
               <div className="float-right mt-2">
                  {this.state.showLogin && (
                     <>
                        <Link to="/log-in" className="collection-link pr-3">
                           Log in
                        </Link>
                     </>
                  )}
                  {/* <Link to="/library-log-in" className="collection-link pr-3">
              Library log in
            </Link> */}
                  {!this.state.showLogin && (
                     <>
                        <Link
                           to="/log-in"
                           className="collection-link"
                           onClick={() => {
                              this.logOutCurrentUser();
                           }}
                        >
                           Log out
                        </Link>
                     </>
                  )}
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
