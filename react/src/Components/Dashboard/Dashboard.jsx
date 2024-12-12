import React from "react";
import { useNavigate } from "react-router-dom";
const DashboardCard = ({ title, iconClass, onClick }) => (

  <div className="col-lg-3 col-md-6">
    <div className="panel panel-success">
      <div className="panel-success-box">
        <div className="panel-heading">
          <div className="row student-card-logo">
            <div className="col-xs-9">
              <div className="huge-heading">{title}</div>
            </div>
            <div className="col-xs-3">
              <i className={`fa ${iconClass} fa-5x card-icon-logo`}></i>
            </div>
          </div>
        </div>
        <div className="panel-footer">
          <div className="pull-left">
            <div className="view-details-button" onClick={onClick}>
              View Details
            </div>
          </div>
          <div className="clearfix"></div>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  

  return (
    <div className="dashbord-container">
      <div className="row dashbord-list">
        <div className="heading-text">
          <h3>
            <i className="fa fa-home fa-1x home-icon-dashbord"></i>Dashboard
          </h3>
          <p>(Admin Portal)</p>
        </div>

        <DashboardCard
          title="Students"
          iconClass="fa-user-graduate"
          onClick={() => {
          console.log("Navigating to /students");
          navigate("/Students");
          }}
        />
        <DashboardCard
          title="Billing"
          iconClass="fa-credit-card"
          onClick={() => {
          console.log("Navigating to /students");
          navigate("/Billing");
          }}
        />
        <DashboardCard
          title="Providers"
          iconClass="fa-chalkboard-teacher"
          onClick={() => {
          navigate("/Providers");
          }}
        />

        <DashboardCard
          title="School"
          iconClass="fa-school"
          onClick={() => {
          navigate("/School");
          }}
        />
        <DashboardCard
          title="Calendar"
          iconClass="fa-calendar-alt"
          onClick={() => {
          navigate("/Calendar");
          }}
        />
        
        <DashboardCard
          title="Holidays"
          iconClass="fa-glass-cheers"
          onClick={() => {
          navigate("/Holidays");
          }}
        />
       
      </div>
    </div>
  );
};

export default Dashboard;
