import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import logo from "../../Assets/logo.png"; // Importing Logo as Loader
import './Dashboard.css';
import PropagateLoader from "react-spinners/PropagateLoader";
const DashboardCard = ({ title, iconClass, onClick, disabled }) => (
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
            <div
              className="view-details-button"
              onClick={!disabled ? onClick : undefined}
              style={disabled ? { cursor: "not-allowed", opacity: 0.5 } : {}}
            >
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userRollID, userRollName } = useAuth();

  useEffect(() => {
    if (userRollID && userRollName) {
      setTimeout(() => setLoading(false), 50); // Simulating Loading Delay
    }
  }, [userRollID, userRollName]);

  const isProvider = userRollName === "Provider";

  return (
    <div className="dashbord-container">
      {loading ? (
        <div className="loader-container">
          <div className="loader-content">
            <img src={logo} alt="Loading..." className="logo-loader" />
            <PropagateLoader  color="#3498db" size={10} />
          </div>
        </div>
      ) : (
        <div className="row dashbord-list">
          <div className="heading-text">
            <h3 style={{ marginTop: "-42px" }}>
              <i className="fa fa-home fa-1x home-icon-dashbord"></i> Dashboard
            </h3>
            <p>{isProvider ? "Provider Portal" : "Admin Portal"}</p>
          </div>

          {!isProvider && (
            <DashboardCard
              title="Schools"
              iconClass="fa-school"
              onClick={() => navigate("/School")}
            />
          )}

          <DashboardCard
            title={isProvider ? "Profile" : "Providers"}
            iconClass="fa-chalkboard-teacher"
            onClick={() => navigate("/Providers")}
          />

          <DashboardCard
            title="Students"
            iconClass="fa-user-graduate"
            onClick={() => navigate("/Students")}
          />

          {!isProvider && (
            <DashboardCard
              title="Holidays"
              iconClass="fa-glass-cheers"
              onClick={() => alert("Coming Soon..")}
              disabled
            />
          )}

          <DashboardCard
            title="Calendar"
            iconClass="fa-calendar-alt"
            onClick={() => navigate("/Calendar")}
          />

          <DashboardCard
            title="Billing"
            iconClass="fa-credit-card"
            onClick={() => alert("Coming Soon..")}
            disabled
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
