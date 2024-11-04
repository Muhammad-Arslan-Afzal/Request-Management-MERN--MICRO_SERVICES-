import React, { useState } from "react";
import { requestAPI } from "../../api/api.js";
import { useNavigate } from "react-router-dom";
import "./RequestForm.css";

const RequestForm = ({ token, requesterEmail, onRequestCreated }) => {
  const initialFormData = {
    title: "",
    description: "",
    type: "Leave",
    urgency: "Low",
    superiorEmail: "",
    requesterEmail: requesterEmail,
  };

  const [formData, setFormData] = useState(initialFormData);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await requestAPI.post("/requests", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      onRequestCreated(response.data);
      setFormData(initialFormData);
      navigate("/dashboard/request-list");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h2>Create a New Request</h2>
      <form onSubmit={handleSubmit} className="request_Form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title} // Bind to formData
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description} // Bind to formData
          onChange={handleChange}
        />
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="Leave">Leave</option>
          <option value="Equipment">Equipment</option>
          <option value="Overtime">Overtime</option>
        </select>
        <select name="urgency" value={formData.urgency} onChange={handleChange}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <input
          type="email"
          name="superiorEmail"
          placeholder="Superior's Email"
          value={formData.superiorEmail} // Bind to formData
          onChange={handleChange}
        />
        <button type="submit">Create Request</button>
      </form>
    </>
  );
};

export default RequestForm;
