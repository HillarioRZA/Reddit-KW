import { useLoaderData, useFetcher } from "react-router-dom";
import { loggedUser } from "../user.json";

function Dokter() {
    const appointmentList = useLoaderData();
    const fetcher = useFetcher();

    async function selectAppointment(index) {
        const data = { selectedIndex: index }; 
        fetcher.submit(data, {
            method: "POST",
            action: `/doctor`,
        });
    }

    return (
        <>
            <table border="1">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Nama Pasien</th>
                        <th>Tanggal Reservasi</th>
                        <th>Keluhan</th>
                        <th>Konsultasi</th>
                    </tr>
                </thead>
                <tbody>
                    {appointmentList.length > 0 ? (
                        appointmentList.map((appointment, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{appointment.patientName}</td>
                                <td>{appointment.reserveDate}</td>
                                <td>{appointment.complain}</td>
                                <td>
                                    <button onClick={() => selectAppointment(appointment.index)}>Consult</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No appointments found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
}

export default Dokter;

