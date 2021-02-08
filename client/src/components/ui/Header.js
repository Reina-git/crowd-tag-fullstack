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
         // showLogin: true,
         isShowingLogout: false,
         isLibraryUser: false,
      };
   }

   componentDidMount() {
      //
      // this.checkUserType();
      // this.setShowLogin();
      this.setHeader();
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
      this.setState({
         isLibraryUser: false,
         isShowingLogout: false,
      });
   }

   setHeader() {
      const authToken = localStorage.authToken;
      const user = jwtDecode(authToken);
      if (authToken) {
         const currentTimeInSec = Date.now() / 1000;
         // const user = jwtDecode(authToken);
         if (currentTimeInSec > user.exp) {
            this.setState({
               isShowingLogout: false,
               isLibraryUser: false,
            });
         } else {
            this.setState({
               isShowingLogout: true,
            });
         }
      } else {
         this.setState({
            showLogin: false,
         });
      }
      if (user.institutionName.length > 0) {
         console.log("is library user");
         this.setState({
            isLibraryUser: true,
         });
      } else {
         this.setState({
            isLibraryUser: false,
         });
      }
   }

   // setShowLogin() {
   //    const authToken = localStorage.authToken;
   //    // console.log(authToken);
   //    if (authToken) {
   //       const currentTimeInSec = Date.now() / 1000;
   //       const user = jwtDecode(authToken);
   //       // console.log("user in header", user);
   //       if (currentTimeInSec > user.exp) {
   //          // console.log("expiredToken");
   //          this.setState({
   //             isShowingLogout: false,
   //          });
   //       } else {
   //          this.setState({
   //             isShowingLogout: true,
   //          });
   //          // console.log("valid token", this.state.isShowingLogout);
   //       }
   //    } else {
   //       // console.log("no token on image page", this.state.isShowingLogout);
   //       this.setState({
   //          showLogin: false,
   //       });
   //    }
   // }

   checkUserType() {
      const authToken = localStorage.authToken;
      if (authToken) {
         // console.log("state", await this.state.isShowingLogout);
         if (this.state.isShowingLogout === true) {
            console.log("show logout === ture");
            const user = jwtDecode(authToken);
            console.log("user in checkUserType", user.institutionName);
            if (user.institutionName.length > 0) {
               this.setState({
                  isLibraryUser: true,
               });
            } else {
               this.setState({
                  isLibraryUser: false,
               });
            }
         } else if (this.state.isShowingLogout === false) {
            console.log("The user logged in is not a library user");
            this.setState({
               isLibraryUser: false,
            });
         }
      } else {
         console.log("The is no user logged in");
         this.setState({
            isLibraryUser: false,
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
                  {!this.state.isShowingLogout && (
                     <>
                        <Link to="/log-in" className="collection-link">
                           Log in
                        </Link>
                     </>
                  )}
                  {/* <Link to="/library-log-in" className="collection-link pr-3">
              Library log in
            </Link> */}

                  {this.state.isLibraryUser && (
                     <>
                        <Link
                           to="/admin-collections"
                           className="collection-link pr-3"
                        >
                           My Collections
                        </Link>
                     </>
                  )}

                  {this.state.isShowingLogout && (
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
