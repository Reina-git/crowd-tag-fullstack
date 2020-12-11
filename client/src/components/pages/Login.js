import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../images/noun_shutter_1063959.svg";
import SignUp from "../ui/SignUp";
import UserLogin from "../ui/UserLogin";

export default function Login() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-xl-8 offset-xl-2 col-lg-10 offset-lg-1">
          <div className="row">
            {/* <!-- top banner--> */}
            <div className="col-12 mt-6">
              <Link to="/" className="Logo-link">
                <img src={Logo} className="mt-n2 logo" alt="shutter logo" />
                <h1 className="d-inline ml-2 font-family-brand" id="logo-text">
                  Crowd Tag
                </h1>
              </Link>
            </div>
          </div>
          <div className="row">
            <SignUp />
            <UserLogin />
          </div>
        </div>
      </div>
    </div>
  );
}
