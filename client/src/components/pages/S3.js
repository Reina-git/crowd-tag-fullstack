import React from "react";
import AppTemplate from "../ui/AppTemplate";
import axios from "axios";

class S3 extends React.Component {
   constructor() {
      super();
      this.state = {
         photoUploadText: "Choose a file",
         photoUploadFile: {},
      };
   }

   setPhotoUploadText(e) {
      const file = e.target.files[0];
      if (file) {
         this.setState({
            photoUploadText: file.name,
            photoUploadFile: file,
         });
      } else {
         this.setState({
            photoUploadText: "Choose a file",
            photoUploadFile: {},
         });
      }
   }

   saveProfile(e) {
      e.preventDefault();
      const formData = new FormData();
      formData.append("profile-photo", this.state.photoUploadFile); // what you want in the url of the image
      formData.append("handle", document.getElementById("handle").value);
      // console.log("testing");
      axios
         .post("/api/v1/test-users", formData)
         .then((res) => {
            console.log(res.data);
         })
         .catch((err) => {
            console.log(err.response.data);
         });
   }

   render() {
      return (
         <AppTemplate>
            <h3 className="mt-6">S3 Demo</h3>
            <h2 className="mb-4">Update user profile</h2>

            {/* https://www.positronx.io/react-file-upload-tutorial-with-node-express-and-multer/ */}
            <form onSubmit={(e) => this.saveProfile(e)}>
               <div className="form-group">
                  <label htmlFor="handle">Create a handle</label>
                  <input
                     className="form-control form-control-sm mb-6"
                     type="text"
                     id="handle"
                  />

                  <p className="mb-2">Upload your profile photo</p>

                  <div className="custom-file mb-6">
                     <input
                        type="file"
                        className="custom-file-input"
                        id="photo-upload"
                        onChange={(e) => {
                           this.setPhotoUploadText(e);
                        }}
                     />
                     <label
                        className="custom-file-label"
                        htmlFor="photo-upload"
                     >
                        {this.state.photoUploadText}
                     </label>
                  </div>

                  <button className="btn btn-success float-right" type="submit">
                     Save your profile
                  </button>
               </div>
            </form>
         </AppTemplate>
      );
   }
}

export default S3;
