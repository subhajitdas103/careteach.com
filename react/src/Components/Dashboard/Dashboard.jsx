import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import ClipLoader from "react-spinners/ClipLoader";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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

const SkeletonCard = () => (
  <div className="col-lg-3 col-md-6">
    <div className="panel panel-success">
      <div className="panel-success-box">
        <div className="panel-heading">
          <div className="row student-card-logo">
            <div className="col-xs-9">
              <Skeleton height={30} width={100} />
            </div>
            <div className="col-xs-3">
              <Skeleton circle={true} height={50} width={50} />
            </div>
          </div>
        </div>
        <div className="panel-footer">
          <Skeleton height={20} width={80} />
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
      setTimeout(() => setLoading(false), 2000); // Simulate loading delay
    }
  }, [userRollID, userRollName]);

  return (
    <div className="dashbord-container">
      {loading ? (
        <div className="row dashbord-list">
          <div className="heading-text">
            <h3>
              <Skeleton width={150} height={30} />
            </h3>
            <p>
              <Skeleton width={200} height={20} />
            </p>
          </div>
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="row dashbord-list">
          <div className="heading-text">
            <h3 style={{ marginTop: "-42px" }}>
              <i className="fa fa-home fa-1x home-icon-dashbord"></i>Dashboard
            </h3>
            <p>{userRollName === "Provider" ? "Provider Portal" : "Admin Portal"}</p>
          </div>

          {userRollName !== "Provider" && (
            <DashboardCard
              title="Schools"
              iconClass="fa-school"
              onClick={() => navigate("/School")}
            />
          )}

        {userRollName === "Provider" ? (
          <DashboardCard title="Profile" iconClass="fa-chalkboard-teacher" onClick={() => navigate("/Providers")} />
        ) : (
          <DashboardCard title="Providers" iconClass="fa-chalkboard-teacher" onClick={() => navigate("/Providers")} />
        )}

          <DashboardCard title="Students" iconClass="fa-user-graduate" onClick={() => navigate("/Students")} />
            
          {userRollName !== "Provider" && (
          <DashboardCard title="Holidays" iconClass="fa-glass-cheers" onClick={() => alert("Coming Soon..")} disabled />
          )}

          <DashboardCard title="Calendar" iconClass="fa-calendar-alt" onClick={() => navigate("/Calendar")} />

          <DashboardCard title="Billing" iconClass="fa-credit-card" onClick={() => alert("Coming Soon..")} disabled />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
