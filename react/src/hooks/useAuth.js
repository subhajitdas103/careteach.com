// src/hooks/useAuth.js
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
const useAuth = () => {
  const [loading, setLoading] = useState(true); // Loading state
const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [userRollID, setUserRollID] = useState(null);
  const [userRollName, setUserRollName] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.log("No token found in localStorage");
      navigate('/login'); // Redirect to login if no token
      setLoading(false);  
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading (true);
        const response = await axios.get(`${backendUrl}/api/roll_id`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { roll_id, roll_name } = response.data;
        setUserRollID(roll_id);
        setUserRollName(roll_name);
        console.log("Fetched roll_id:", roll_id, "Fetched roll_name:", roll_name);
      } catch (err) {
        console.error("Error fetching roll_id:", err.response?.status, err.response?.data);
      } finally {
        setLoading(false);  // Done loading
      }
    };

    fetchUserData();
  }, [backendUrl, navigate]);

  return { userRollID, userRollName,loading ,setUserRollID, setUserRollName};
};

export default useAuth;
