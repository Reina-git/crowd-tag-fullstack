import React from "react";
import classnames from "classnames";
import hash from "object-hash";
import { v4 as getUuid } from "uuid";
import { withRouter } from "react-router-dom";
import axios from "axios";
import actions from "../../store/actions";
import { connect } from "react-redux";
import { EMAIL_REGEX } from "../../utils/helpers";

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDisplayingInputs: false,
      emailError: "",
      passwordError: "",
      hasEmailError: false,
      hasPasswordError: false,
      isDisplayingLibrary: false,
    };
  }
  showInputs() {
    this.setState({
      isDisplayingInputs: true,
    });
  }

  async setEmailState(emailInput) {
    const lowerCasedEmailInput = emailInput.toLowerCase();

    if (emailInput === "") {
      this.setState({
        emailError: "Please enter your email address.",
        hasEmailError: true,
      });
    } else if (EMAIL_REGEX.test(lowerCasedEmailInput) === false) {
      this.setState({
        emailError: "Please enter a valid email address.",
        hasEmailError: true,
      });
    } else {
      this.setState({ emailError: "", hasEmailError: false });
    }
  }
  checkHasLocalPart(passwordInput, emailInput) {
    const localPart = emailInput.split("@")[0];
    if (localPart === "") return false;
    else if (localPart.length < 4) return false;
    else return passwordInput.includes(localPart);
    // if (passwordInput.includes(localPart) return truse... else return false.... the above code means the same thing)
  }

  async setPasswordState(passwordInput, emailInput) {
    console.log(passwordInput);
    const uniqChars = [...new Set(passwordInput)];
    console.log(uniqChars);
    if (passwordInput === "") {
      this.setState({
        passwordError: "Please enter a password.",
        hasPasswordError: true,
      });
    } else if (passwordInput.length < 9) {
      this.setState({
        passwordError: "Your password must be at least 9 characters.",
        hasPasswordError: true,
      });
    } else if (this.checkHasLocalPart(passwordInput, emailInput)) {
      this.setState({
        passwordError:
          "For your safety, your password cannot contain your email address.",
        hasPasswordError: true,
      });
    } else if (uniqChars.length < 3) {
      this.setState({
        passwordError:
          "For your safety, your password must contain at least 3 unique characters.",
        hasPasswordError: true,
      });
    } else {
      this.setState({ passwordError: "", hasPasswordError: false });
    }
  }

  async validateAndCreateUser() {
    const emailInput = document.getElementById("sign-up-email-input").value;
    const passwordInput = document.getElementById("sign-up-password-input");
    // const libraryName = document.getElementById("sign-up-library-name").value;
    await this.setEmailState(emailInput);
    await this.setPasswordState(passwordInput, emailInput);
    if (
      this.state.hasEmailError === false &&
      this.state.hasPasswordError === false
    ) {
      const user = {
        id: getUuid(),
        email: emailInput,
        password: hash(passwordInput),
        createdAt: Date.now(),
        // libraryName: libraryName,
      };
      console.log(user);
      axios
        .get(
          "https://raw.githubusercontent.com/Reina-git/Crowd-Tag-React/main/src/mock-data/user.json"
        )
        .then((res) => {
          // handle success
          const currentUser = res.data;
          console.log(currentUser);
          this.props.dispatch({
            type: actions.STORE_CURRENT_USER,
            payload: res.data,
          });
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
      // make a push to different pages based on who is loggin in
      this.props.history.push("/");
    }
  }

  render() {
    return (
      <div className="col-12 col-lg-5">
        <div className="card card-body-padding mt-9 d-flex justify-content-center">
          <h2>Nice to meet you.</h2>
          {!this.state.isDisplayingInputs && <p>Sign up for Crowd Tag.</p>}
          <div id="sign-up-card">
            {this.state.isDisplayingInputs && (
              <>
                <p className="text-primary mt-3">Let's get you signed up</p>

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
                {/* <div className="custom-control custom-checkbox mt-n3">
                  <input
                    type="checkbox"
                    className="custom-control-input mt-n3"
                    id="showLibrary"
                    name="showLibrary"
                    checked={this.state.isDisplayingLibrary}
                    value={!this.state.isDisplayingLibrary}
                    onChange={() => {
                      this.showLibrary();
                    }}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor={"showLibrary"}
                  >
                    <p className="text-muted">
                      {" "}
                      I am a library administrator and want to add photographs
                      to be tagged.
                    </p>
                  </label>
                </div>
                <div className="mt-4 mb-3">
                  {this.state.isDisplayingLibrary && (
                    <>
                      <p className="text-muted mt-3 lead">Library name</p>

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
                    </>
                  )}
                </div> */}

                {this.state.hasEmailError && (
                  <p className="text-danger lead mt-2" id="sign-up-email-error">
                    {this.state.emailError}
                  </p>
                )}

                <p className="text-muted mt-3 lead">Create a password</p>
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
