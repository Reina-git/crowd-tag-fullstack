import React from "react";
import classnames from "classnames";
import { v4 as getUuid } from "uuid";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import actions from "../../store/actions";
import jwtDecode from "jwt-decode";

class SignUp extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         isDisplayingInputs: false,
         emailError: "",
         passwordError: "",
         hasEmailError: false,
         hasPasswordError: false,
         isNotLibraryUser: true,
      };
   }
   showInputs() {
      this.setState({
         isDisplayingInputs: true,
      });
   }
   showLibrary() {
      this.setState({
         isNotLibraryUser: !this.state.isNotLibraryUser,
      });
   }
   validateAndCreateUser() {
      const emailInput = document.getElementById("sign-up-email-input").value;
      const passwordInput = document.getElementById("sign-up-password-input")
         .value;
      let institutionName = "";
      if (document.getElementById("sign-up-library-name").value === null) {
         institutionName = "";
      } else {
         institutionName = document.getElementById("sign-up-library-name")
            .value;
      }
      // create user obj
      const user = {
         id: getUuid(),
         email: emailInput,
         password: passwordInput,
         createdAt: Date.now(),
         institutionName: institutionName,
      };
      // console.log(currentUser);
      axios
         .post("/api/v1/users", user)
         .then((res) => {
            const authToken = res.data;
            console.log(authToken);
            localStorage.setItem("authToken", authToken);
            const user = jwtDecode(authToken);
            this.props.dispatch({
               type: actions.STORE_CURRENT_USER,
               payload: user,
            });

            axios.defaults.headers.common["x-auth-token"] = authToken;

            if (user.institutionName === "") {
               this.props.history.push("/");
            } else if (user.institutionName !== "") {
               this.props.history.push("/admin-collections");
            }
         })
         .catch((err) => {
            console.log(err);
            const data = err.response.data;

            const { emailError, passwordError } = data;
            if (emailError !== "") {
               this.setState({ hasEmailError: true, emailError: emailError });
            } else {
               this.setState({ hasEmailError: false, emailError });
            }
            if (passwordError !== "") {
               this.setState({
                  hasPasswordError: true,
                  passwordError: passwordError,
               });
            } else {
               this.setState({ hasPasswordError: false, passwordError });
            }
         });
   }

   render() {
      return (
         <div className="col-12 col-lg-5">
            <div className="card card-body-padding mt-9 d-flex justify-content-center">
               {!this.state.isDisplayingInputs && <h2>Nice to meet you</h2>}
               <p className="text-muted">Sign up for Crowd Tag.</p>
               <div id="sign-up-card">
                  {this.state.isDisplayingInputs && (
                     <>
                        <p className="text-muted mt-3">
                           Let's get you signed up
                        </p>

                        <p className="text-muted mt-3 lead">Email address</p>

                        <div className="input-group mb-3 mt-2">
                           <input
                              type="text"
                              id="sign-up-email-input"
                              className={classnames({
                                 "form-control": true,
                                 "mb-2": true,
                                 "is-invalid": this.state.hasEmailError,
                              })}
                              aria-label="Sizing example input"
                              aria-describedby="inputGroup-sizing-default"
                           />
                        </div>

                        {this.state.hasEmailError && (
                           <p
                              className="text-danger lead mt-n4 mb-2"
                              id="sign-up-email-error"
                           >
                              {this.state.emailError}
                           </p>
                        )}

                        {/* new field */}
                        <div className="custom-control custom-checkbox mt-n2">
                           <input
                              type="checkbox"
                              className="custom-control-input mt-n3"
                              id="showLibrary"
                              name="showLibrary"
                              checked={!this.state.isNotLibraryUser}
                              value={this.state.isNotLibraryUser}
                              onChange={() => {
                                 this.showLibrary();
                              }}
                           />
                           <label
                              className="custom-control-label"
                              htmlFor="showLibrary"
                           >
                              <p className="text-muted">
                                 {" "}
                                 I am a library administrator and want to add
                                 photographs to be tagged.
                              </p>
                           </label>
                        </div>
                        <div className="mt-4 mb-3">
                           <div
                              className={classnames({
                                 "d-none": this.state.isNotLibraryUser,
                              })}
                           >
                              <p className="text-muted mt-3 lead">
                                 Library name
                              </p>

                              <div className="input-group mb-3 mt-2">
                                 <input
                                    type="text"
                                    id="sign-up-library-name"
                                    className={classnames({
                                       "form-control": true,
                                       "mb-2": true,
                                    })}
                                    aria-label="Sizing example input"
                                    aria-describedby="inputGroup-sizing-default"
                                 />
                              </div>
                           </div>
                        </div>

                        {/* end */}

                        <p className="text-muted mt-3 lead">
                           Create a password
                        </p>
                        <p className="text-muted lead">
                           Must be at least 9 characters.
                        </p>
                        <div className="input-group mb-3 mt-2">
                           <input
                              type="text"
                              id="sign-up-password-input"
                              aria-label="Sizing example input"
                              aria-describedby="inputGroup-sizing-default"
                              className={classnames({
                                 "form-control": true,
                                 "mb-2": true,
                                 "is-invalid": this.state.hasPasswordError,
                              })}
                           />
                        </div>

                        {this.state.passwordError !== "" && (
                           <p
                              className="lead mt-2 text-danger"
                              id="sign-up-password-error"
                           >
                              {this.state.passwordError}
                           </p>
                        )}

                        <button
                           to="/create-answer"
                           className="btn btn-primary btn-block mt-5"
                           id="letsGoButton"
                           onClick={() => {
                              this.validateAndCreateUser();
                           }}
                        >
                           Let's go!
                        </button>
                     </>
                  )}
                  {!this.state.isDisplayingInputs && (
                     <button
                        className="btn btn-primary btn-block d-flex justify-content-center mt-5"
                        onClick={() => {
                           this.showInputs();
                        }}
                     >
                        Sign up
                     </button>
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
export default withRouter(connect(mapStateToProps)(SignUp));
