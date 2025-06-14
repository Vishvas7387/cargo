import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Stepper,
    Step,
    StepLabel,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, Polyline, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Api from "../api";
import { useParams } from "react-router-dom";
import train from "../assets/train.png"
import { useNavigate } from "react-router-dom";

const steps = [
    "Booking Confirmed",
    "Cargo Loaded",
    "On the Way",
    "Destination Arrived",
];

const customIcon = new L.Icon({
    iconUrl: train,
    iconSize: [32, 32],
});

const interpolate = (start, end, factor) => start + (end - start) * factor;

const TrackBookings = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [currentPosition, setCurrentPosition] = useState(null);
    const navigate = useNavigate();
    const [remainingSeconds, setRemainingSeconds] = useState(4 * 60 * 60); // 4 hours in seconds
    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs} hr ${mins} min ${secs} sec`;
    };

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await Api.trackBooking(id);
                if (!res.data || !res.data.booking) {
                    console.error("Booking data missing:", res.data);
                    return;
                }

                const booking = res.data.booking;
                setBooking(booking);

                const fromLat = parseFloat(booking.fromCity.lat);
                const fromLng = parseFloat(booking.fromCity.lng);
                const toLat = parseFloat(booking.toCity.lat);
                const toLng = parseFloat(booking.toCity.lng);

                if ([fromLat, fromLng, toLat, toLng].some(val => isNaN(val))) {
                    console.error("Lat/Lng values are invalid (NaN):", { fromLat, fromLng, toLat, toLng });
                    return;
                }

                // Initially show "Booking Confirmed"
                setCurrentPosition([fromLat, fromLng]);
                setActiveStep(0); // Booking Confirmed

                // Wait 2 seconds → then show "Cargo Loaded"
                setTimeout(() => {
                    setActiveStep(1); // Cargo Loaded

                    // Wait another 1s → start animation
                    setTimeout(() => {

                        let step = 0;
                        const totalSteps = 100;
                        const totalDurationSec = 4 * 60 * 60; // 4 hours


                        const interval = setInterval(() => {
                            step++;
                            const lat = interpolate(fromLat, toLat, step / totalSteps);
                            const lng = interpolate(fromLng, toLng, step / totalSteps);
                            setCurrentPosition([lat, lng]);

                            if (step < 60) {
                                setActiveStep(2); // On the Way
                            } else if (step >= 95) {
                                setActiveStep(3); // Destination Arrived
                            }
                            const totalDurationSec = 4 * 60 * 60;
                            const estimatedRemaining = Math.max(
                                Math.floor(totalDurationSec * ((totalSteps - step) / totalSteps)),
                                0
                            );
                            setRemainingSeconds(estimatedRemaining);
                            if (step >= totalSteps) {
                                clearInterval(interval);

                                setRemainingSeconds(0); // Force it to "Arrived"
                            }
                        }, 2000); // smoother animation
                    }, 2000);
                }, 2000); // 2s delay for "Booking Confirmed" → "Cargo Loaded"

            } catch (err) {
                console.error("Error in fetchBooking:", err);
            }
        };

        fetchBooking();
    }, [id]);


    if (!booking || !currentPosition) return <div>Loading...</div>;

    const centerLat = (parseFloat(booking.fromCity.lat) + parseFloat(booking.toCity.lat)) / 2;
    const centerLng = (parseFloat(booking.fromCity.lng) + parseFloat(booking.toCity.lng)) / 2;

    const smallIcon = new L.Icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconSize: [20, 30], // smaller than default [25, 41]
        iconAnchor: [10, 30], // adjusts the "point" of the icon
        popupAnchor: [1, -34],
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        shadowSize: [30, 30],
    });

    return (
        <div className="flex h-screen">
            {/* Left panel */}
            <div className="w-1/2  overflow-y-auto">


                <div className="bg-white shadow-md rounded-2xl p-4 h-screen">
                    <h2 className="text-2xl font-semibold mb-4">
                        Track Your Booking
                    </h2>
                    <hr class="h-px mb-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                    <p className="text-gray-700 mb-2">
                        <strong>Booking Id:</strong> #{booking.id}
                    </p>
                    <p className="text-gray-700 mb-2">
                        <strong>From:</strong> {booking.fromCity.name}
                    </p>
                    <p className="text-gray-700 mb-2">
                        <strong>To:</strong> {booking.toCity.name}
                    </p>
                    <p className="text-gray-700 mb-2">
                        <strong>Estimated Arrival:</strong> {remainingSeconds === 0 ? "Arrived" : formatTime(remainingSeconds)}
                    </p>
                    <p className="text-gray-700">
                        <strong>Status:</strong> {steps[activeStep]}
                    </p>


                    <div className="mt-4">
                        <Stepper
                            activeStep={activeStep}
                            orientation="vertical"
                            sx={{
                                '& .MuiStepIcon-root.Mui-completed': {
                                    color: 'green',
                                },
                                '& .MuiStepIcon-root.Mui-active': {
                                    color: 'green',
                                },
                                '& .MuiStepLabel-label.Mui-active': {
                                    color: 'green',
                                },
                                '& .MuiStepLabel-label.Mui-completed': {
                                    color: 'green',
                                },
                            }}
                        >
                            {steps.map((label, index) => (
                                <Step key={index} completed={index < activeStep}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                    </div>
                    <div className="flex  justify-center mt-6">
                        <button type="button"
                            onClick={() => navigate("/profile")}
                            className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                            Go to Profile</button>
                    </div>
                </div>
            </div>
            {/* Right panel: Map */}

            <div className="w-1/2 h-screen border rounded-lg overflow-hidden">
                <MapContainer
                    center={[centerLat, centerLng]}
                    zoom={9}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                    />
                    <Polyline
                        positions={[
                            [parseFloat(booking.fromCity.lat), parseFloat(booking.fromCity.lng)],
                            [parseFloat(booking.toCity.lat), parseFloat(booking.toCity.lng)],
                        ]}
                    />
                    <Marker position={currentPosition} icon={customIcon} />

                    <Marker position={[booking.fromCity.lat, booking.fromCity.lng]} icon={smallIcon}>
                        <Tooltip
                            permanent
                            direction="right"
                            offset={[0, -10]}
                            className="bg-white !border-none !shadow-none !text-blue-600 font-semibold !text-sm"
                        >
                            {booking.fromCity.name}
                        </Tooltip>
                    </Marker>


                    <Marker position={[booking.toCity.lat, booking.toCity.lng]} icon={smallIcon}>
                        <Tooltip
                            permanent
                            direction="left"
                            offset={[0, -10]}
                            className="bg-white !border-none !shadow-none !text-green-500 font-semibold !text-lg"
                        >
                            {booking.toCity.name}
                        </Tooltip>
                    </Marker>



                </MapContainer>
            </div>
        </div>
    );
};

export default TrackBookings;
