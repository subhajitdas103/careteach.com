import {React,useEffect , useState} from "react";
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
  const [UserData, setUserData] = useState([]);

  useEffect(() => {
    const FetchUserDetails = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No authentication token found.');
        return;  // Exit if no token is available
      }
  
      try {
        const response = await fetch('/api/FetchUserDetails/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
  
        const data = await response.json();
        console.log("Users", data);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
  
    FetchUserDetails();
  }, []);  // This will run once when the component mounts
  


 
  // const hasRollId2 = UserData.some(user => user.roll_id === 2);
  return (
    <div className="dashbord-container">
      <div className="row dashbord-list">
        <div className="heading-text">
          <h3>
            <i className="fa fa-home fa-1x home-icon-dashbord"></i>Dashboard
          </h3>
          {/* <p>(Admin Portal)</p> */}
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
            alert("Under development.. ");
          // navigate("/Billing");
          }}
          style={{ cursor: 'not-allowed', opacity: 0.5 }} // Disable click appearance
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
          style={UserData?.roll_id === 2 ? { display: 'none' } : {}}
        />
        <DashboardCard
          title="Calendar"
          iconClass="fa-calendar-alt"
          onClick={() => {
          navigate("/Calendar");
          }}
        />

        {/* <DashboardCard
          title="Calendar"
          iconClass="fa-calendar-alt"
          onClick={() => {
            alert("Under development.. ");
            // Optionally, you can add a condition to prevent navigation
          }}
          style={{ cursor: 'not-allowed', opacity: 0.5 }} // Disable click appearance
        /> */}

        <DashboardCard
          title="Holidays"
          iconClass="fa-glass-cheers"
          onClick={() => {
            alert("Under development.. ");
          // navigate("/Holidays");
          }}
          style={{ cursor: 'not-allowed', opacity: 0.5 }} // Disable click appearance
        />
       
      </div>
    </div>
  );
};

export default Dashboard;
