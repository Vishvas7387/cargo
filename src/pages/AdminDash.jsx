import React, { useState, useEffect } from "react";
import { ContainerForm } from "../components/ContainerForm";
import { ContainerLs } from "../components/ContainerLs";
import axios from "axios";
import { toast } from "react-toastify";
import Api from "../api";

export const AdminDash = () => {
  const [containers, setContainers] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const id = user?.id;

  const fetchContainers = async () => {
    try {
      const response = await Api.getContainers(id);
      setContainers(response.data); 
      console.log(response.data);
      toast.success("Containers fetched!!");
    } catch (err) {
      console.error("Error fetching containers", err);
      toast.error(err.response?.data?.message || "Failed to fetch containers");
    }
  };


  useEffect(() => {
    fetchContainers();
  }, []);

  const onContainerAdded = () => {
    fetchContainers();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      <ContainerForm adminId={id} onContainerAdded={onContainerAdded} />
      <ContainerLs containers={containers} />
    </div>
  );
};
