import React from "react";
import classnames from "classnames";
import { withRouter } from "react-router-dom";
import axios from "axios";
import actions from "../../store/actions";
import { connect } from "react-redux";

class Login extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         isDisplayingInputs: false,
         emailError: "",
         passwordError: "",
         hasEmailError: false,
         hasPasswordError: false,
      };
   }

   showInputs() {
      this.setState({
         isDisplayingInputs: true,
      });
   }

   async validateAndLoginUser() {
      const emailInput = document.getElementById("email-input").value;
      const passwordInput = document.getElementById("password-input").value;
      const user = {
         email: emailInput,
         password: passwordInput,
      };
      //   console.log("created user object", user);
      axios
         .post("/api/v1/users/auth", user)
         .then((res) => {
            this.props.dispatch({
               type: actions.STORE_CURRENT_USER,
               payload: res.data,
            });
            if (res.data.institutionName === "") {
               this.props.history.push("/");
            } else if (res.data.institutionName !== "") {
               this.props.history.push("/admin-collections");
            }
         })
         .catch((err) => {
            const { data } = err.response;
            // console.log(data);
            const { emailError, passwordError } = data;
            if (emailError !== "") {
               this.setState({ hasEmailError: true, emailError });
            } else {
               this.setState({ hasEmailError: false, emailError });
            }
            if (passwordError !== "") {
               this.setState({
                  hasPasswordError: true,
                  passwordError,
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
               <h2>Welcome back</h2>

               <p className="mt-3">
                  Log in with your email address and password.
               </p>
               <p className="text-muted mt-3 lead">Email address</p>

               <div className="input-group mb-3 mt-2">
                  <input
                     type="text"
                     aria-label="Sizing example input"
                     className={classnames({
                        "form-control": true,
                        "mb-2": true,
                        "is-invalid": this.state.hasEmailError,
                     })}
                     aria-describedby="inputGroup-sizing-default"
                     id="email-input"
                  />
               </div>
               {this.state.hasEmailError && (
                  <p className="text-danger lead mt-2" id="email-error">
                     {this.state.emailError}
                  </p>
               )}

               <p className="text-muted mt-3 lead">Password</p>

               <div className="input-group mb-3 mt-2">
                  <input
                     type="text"
                     aria-label="Sizing example input"
                     id="password-input"
                     aria-describedby="inputGroup-sizing-default"
                     className={classnames({
                        "form-control": true,
                        "mb-2": true,
                        "is-invalid": this.state.hasPasswordError,
                     })}
                  />
               </div>

               {this.state.passwordError !== "" && (
                  <p className="lead mt-2 text-danger" id="password-error">
                     {this.state.passwordError}
                  </p>
               )}

               <button
                  to="/"
                  className="btn btn-primary btn-block mt-5"
                  id="letsGoButton"
                  onClick={() => {
                     this.validateAndLoginUser();
                  }}
               >
                  Login
               </button>
            </div>
         </div>
      );
   }
}

function mapStateToProps(state) {
   return {};
}
export default withRouter(connect(mapStateToProps)(Login));
