import React, { useState, useEffect } from "react";
import { requestAPI } from "../api/api.js";

function RequestList({ requests, isApprover }) {
  const [localRequests, setLocalRequests] = useState(requests);

  useEffect(() => {
    // Sync the local state with the incoming requests prop
    setLocalRequests(requests);
  }, [requests]);

  const handleApprove = async (requestId) => {
    try {
      const response = await requestAPI.post(`/requests/${requestId}/approve`);
      alert("Request approved successfully");
      // Update the local request status to reflect the approval
      setLocalRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId
            ? { ...request, status: "Approved" }
            : request
        )
      );
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const response = await requestAPI.post(`/requests/${requestId}/reject`);
      alert("Request rejected successfully");
      // Update the local request status to reflect the rejection
      setLocalRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId
            ? { ...request, status: "Rejected" }
            : request
        )
      );
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <div>
      <h2>Request List</h2>
      <ul>
        {localRequests.map((request) => (
          <li key={request._id}>
            <h4>Title: {request.title}</h4>
            <p>Description: {request.description}</p>
            <p>Status: {request.status}</p>
            <p>Requester Email: {request.requesterEmail}</p>
            {isApprover && request.status === "Pending" && (
              <>
                <button onClick={() => handleApprove(request._id)}>
                  Approve
                </button>
                <button onClick={() => handleReject(request._id)}>
                  Reject
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RequestList;
