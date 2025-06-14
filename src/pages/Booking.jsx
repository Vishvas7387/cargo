import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { TextField, Button, Autocomplete } from "@mui/material";
import {
  EmailOutlined,
  PhoneOutlined,
  LockClockOutlined,
} from "@mui/icons-material";
import Left from "../animated-components/Left";
import Right from "../animated-components/Right";
import Center from "../animated-components/Center";
import DCenter from "../animated-components/DCenter";
import Api from "../api/index.js";

// import Api from "../api";


const Bookings = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const ifuser = JSON.parse(localStorage.getItem("user"));
    if (!ifuser) {
      toast.error("Please login to book cargo.");
      navigate("/login");
    }
    setUser(ifuser);
    setFormData({ ...formData, email: ifuser.email });
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    from: "",
    to: "",
    height: "",
    width: "",
    breadth: "",
    description: "",
  });
  const navigate = useNavigate();
  const [message, setMessage] = useState("Click to check availability");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDropdownChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await Api.bookCargo(formData);
      if (response.data.proceedToPayment) {
        toast.success(response.data.message);
        toast.success(`Pay ₹${response.data.cost} to proceed.`, {
          autoClose: 10000,
        });
        setMessage("Redirecting to payment...");
        navigate(`/payment/${response.data.bookingID}`);
      } else {
        toast.error("No space available for the specified dimensions.");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.message || "Booking failed. Try again.");
    }
  };

  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await Api.fetchCities(); // 🚀 Make sure this route exists in your API
        const cityObjects = response.data.cities.map(city => ({
          id: city.id,
          name: city.name,
        }));
        setCities(cityObjects);


      } catch (err) {
        toast.error("Failed to fetch cities.");
        console.error(err);
      }
    };
    fetchCities();

  }, []);




  return (
    <div className="bg-[#0e1b4d] h-[90vh]  flex items-center justify-center">
      <div className="container mx-auto ">
        <div className="flex flex-col lg:flex-row  ">

          {/* LEFT: Place your order section */}
          <div className="w-full  lg:w-1/3 bg-linear-to-r from-cyan-500 to-blue-500 text-white  p-6 flex flex-col space-y-4 shadow-md h-[90vh] justify-center">
            <div className="ml-28">
              <DCenter>
                <h2 className="text-3xl font-bold">Place your order</h2>
              </DCenter>
              <Center>
                <div className="flex items-center space-x-3">
                  <EmailOutlined />
                  <div>
                    <p className="text-lg">Email</p>
                    <p>contact@logistics.com</p>
                  </div>
                </div>
              </Center>
              <Center>
                <div className="flex items-center space-x-3">
                  <PhoneOutlined />
                  <div>
                    <p className="text-lg">Call Us</p>
                    <p>+91 123 456 7890</p>
                  </div>
                </div>
              </Center>
              <Center>
                <div className="flex items-center space-x-3">
                  <LockClockOutlined />
                  <div>
                    <p className="text-lg">Daily</p>
                    <p>24 X 7</p>
                  </div>
                </div>
              </Center>
            </div>
          </div>

          {/* RIGHT: Booking form section */}
          <div className="w-full  lg:w-2/3 bg-white text-black  p-8 shadow-md h-[90vh] flex flex-col justify-between items-center">
            <Right>
              <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
                📦 Book Your Parcel Space
              </h2>

              <form
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                onSubmit={handleSubmit}
              >

                <Autocomplete
                  options={cities}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, value) =>
                    handleDropdownChange("from", value?.id || "")
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="From"
                      variant="outlined"
                      InputLabelProps={{ style: { color: "#000" } }}
                      InputProps={{
                        ...params.InputProps,
                        style: { color: "#000" },
                      }}
                      className="bg-white border border-gray-300"
                      fullWidth
                    />
                  )}
                />

                <Autocomplete
                  options={cities}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, value) =>
                    handleDropdownChange("to", value?.id || "")
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="To"
                      variant="outlined"
                      InputLabelProps={{ style: { color: "#000" } }}
                      InputProps={{
                        ...params.InputProps,
                        style: { color: "#000" },
                      }}
                      className="bg-white border border-gray-300"
                      fullWidth
                    />
                  )}
                />

                <TextField
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    style: { color: "#000" },
                  }}
                  type="number"
                  label="Height of the Parcel"
                  variant="outlined"
                  InputLabelProps={{ style: { color: "#000" } }}
                  className="bg-white border border-gray-300"
                  fullWidth
                  name="height"
                  onChange={handleInputChange}
                />

                <TextField
                  label="Width of the Parcel"
                  variant="outlined"
                  type="number"
                  InputLabelProps={{ style: { color: "#000" } }}
                  InputProps={{
                    style: { color: "#000" },
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                  className="bg-white border border-gray-300"
                  fullWidth
                  name="width"
                  onChange={handleInputChange}
                />

                <TextField
                  label="Breadth of the Parcel"
                  variant="outlined"
                  type="number"
                  InputLabelProps={{ style: { color: "#000" } }}
                  InputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    style: { color: "#000" },
                  }}
                  className="bg-white border border-gray-300"
                  fullWidth
                  name="breadth"
                  onChange={handleInputChange}
                />

                <TextField
                  label="Parcel Description"
                  variant="outlined"
                  InputLabelProps={{ style: { color: "#000" } }}
                  InputProps={{ style: { color: "#000" } }}
                  className="bg-white border border-gray-300 col-span-1 md:col-span-2"
                  rows={6}
                  multiline
                  fullWidth
                  name="description"
                  onChange={handleInputChange}
                />
              </form>
            </Right>

            <div className="mt-6">
              <Left>
                <Button
                  variant="contained"
                  className="bg-[#f4b41a] text-white px-8 py-3"
                  onClick={handleSubmit}
                >
                  {message}
                </Button>
              </Left>
            </div>

            <Left>
              <div className="text-center mt-8 text-sm text-gray-600">
                <p>We will send Tracker ID to registered Email</p>
              </div>
            </Left>
          </div>
        </div>
      </div>
    </div>
  );

};

export default Bookings;
