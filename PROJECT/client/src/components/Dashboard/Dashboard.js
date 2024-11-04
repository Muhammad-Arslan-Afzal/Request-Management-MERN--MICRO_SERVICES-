import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import RequestForm from "../RequestForm/RequestForm.js";
import RequestList from "../RequestList.js";
import { requestAPI } from "../../api/api.js";
import "./Dashboard.css";

export default function Dashboard({ token, requesterEmail, userRole }) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await requestAPI.get("/requests");
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    fetchRequests();
  }, [token]);

  return (
    <div>
      {userRole === "superior" ? (
        <RequestList requests={requests} isApprover={true} />
      ) : (
        <>
          <nav className="navbar">
            <Link to="/dashboard/request-form" className="nav-link">
              Create Request
            </Link>
            <Link to="/dashboard/request-list" className="nav-link">
              View Requests
            </Link>
          </nav>
          <Routes>
            <Route
              path="request-form"
              element={
                <RequestForm
                  requesterEmail={requesterEmail}
                  token={token}
                  onRequestCreated={(newRequest) =>
                    setRequests([...requests, newRequest])
                  }
                />
              }
            />
            <Route
              path="request-list"
              element={<RequestList requests={requests} />}
            />
          </Routes>
        </>
      )}
    </div>
  );
}
