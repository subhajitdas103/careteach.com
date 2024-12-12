import React from "react";
import { Helmet } from "react-helmet";

const HolidayForm = () => {
  return (
    <>
      <Helmet>
        {/* External Styles */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
          crossOrigin="anonymous"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N"
          crossOrigin="anonymous"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100;200;300;400;500;600;700;800;900&family=Poppins:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,900;1,400&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <link rel="icon" type="image/x-icon" href="favicon/favicon.ico" />
        {/* External Scripts */}
        <script src="https://unpkg.com/scrollreveal"></script>
      </Helmet>

      <header>
        <div className="dashbord-container">
          <div className="row dashbord-list">
            <div className="heading-text personal-info-text">
              <h3>Basic Information</h3>
              <i
                className="fa fa-backward fc-back-icon"
                aria-hidden="true"
                id="back_addholiday_click"
              ></i>
            </div>
          </div>

          <div className="row dashbord-list personal-profile">
            <div className="stu-pro-field-div">
              <div className="col-md-6 student-profile-field">
                <label>Name:</label>
                <input
                  type="text"
                  className="stu-pro-input-field sch-dropbtn"
                  placeholder="Enter name"
                />
              </div>
            </div>

            <div className="stu-pro-field-div">
              <div className="col-md-6 student-profile-field">
                <label>Start Date:</label>
                <input
                  type="date"
                  className="stu-pro-input-field"
                  placeholder="Enter date"
                />
              </div>

              <div className="col-md-6 student-profile-field">
                <label>End Date:</label>
                <input
                  type="date"
                  id="start"
                  className="stu-pro-input-field"
                  placeholder="Enter date"
                />
              </div>
            </div>
          </div>

          <div className="save-student-btn">Save Holiday</div>
        </div>
      </header>
    </>
  );
};

export default HolidayForm;
