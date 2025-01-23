import { useLoaderData } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

function PasienAppointment() {
    const appointmentList = useLoaderData();
    const [appointments, setAppointments] = useState(appointmentList);

    async function buyMedicines(appointmentId, medicines) {
        alert("not functional")
        // try {
        //     const response = await axios.put('http://localhost:3000/api/patient/buy-medicine', {
        //         appointmentId,
        //         medicines,
        //     });

        //     alert(response.data.message);

        //     setAppointments((prev) =>
        //         prev.map((appointment) =>
        //             appointment._id === appointmentId ? { ...appointment, status: 'Purchased' } : appointment
        //         )
        //     );
        // } catch (error) {
        //     console.error('Error buying medicines:', error);
        //     alert('Failed to complete purchase. Please try again.');
        // }
    }

    return (
        <>
            <h2>My Appointments</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Doctor Name</th>
                        <th>Solution</th>
                        <th>Status</th>
                        <th>Recommended Medicines</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.length > 0 ? (
                        appointments.map((appointment, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{appointment.doctorName}</td>
                                <td>{appointment.solution}</td>
                                <td>{appointment.status}</td>
                                <td>
                                    {appointment.medicines?.length > 0 ? (
                                        <ul>
                                            {appointment.medicines.map((medicine) => (
                                                <li key={medicine.code}>
                                                    {medicine.name} (Stock: {medicine.stock})
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        'No recommended medicines'
                                    )}
                                </td>
                                <td>
                                    {appointment.medicines?.length > 0 && appointment.status !== 'Purchased' ? (
                                        <button onClick={() => buyMedicines(appointment._id, appointment.medicines)}>
                                            Buy for Free
                                        </button>
                                    ) : (
                                        'No Action'
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No appointments found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
}

export default PasienAppointment;
