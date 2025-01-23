import { loggedUser, selectedConsult } from "../user.json";
import { redirect } from "react-router-dom";
import axios from "axios";

async function loadUserList() { //sudah update
    const response = await axios.get('http://localhost:3000/api/admin/user');
    return response.data;
}

async function loadDoctorList() { //sudah update
    const response = await axios.get('http://localhost:3000/api/doctor');
    return response.data;
}

async function registerUser(data) { //sudah update
    if (data.request.method === "POST") {
        const formData = await data.request.formData();
        const newUser = Object.fromEntries(formData);

        try {
            const response = await axios.post('http://localhost:3000/api/user/register', newUser);
            alert("User is successfully added");
            return redirect("/login");
        } catch (error) {
            if (error.response) {
                console.error("Error:", error.response.data.message);
                alert(error.response.data.message);
            } else if (error.request) {
                console.error("No response from server:", error.request);
                alert("Failed to connect to the server. Please try again later.");
            } else {
                console.error("Error setting up request:", error.message);
                alert("An unexpected error occurred. Please try again.");
            }
        }
        
    }
}

async function loginUser(data) { //sudah update
    if (data.request.method === "POST") {
        const formData = await data.request.formData();
        const userLogged = Object.fromEntries(formData);

        if (userLogged.username === "admin" && userLogged.password === "admin") {
            loggedUser.pop()
            loggedUser.push({username: "admin", password: "admin"})
            return redirect("/admin");
        }

        try {
            const response = await axios.post('http://localhost:3000/api/user/login', userLogged);
            const role = response.data.role === "Pasien" ? "Pasien" : "Dokter";
            alert("User is logged in");
            loggedUser.pop()
            loggedUser.push(response.data)
            return redirect(role === "Pasien" ? "/patient" : "/doctor");
        } catch (error) {
            if (error.response) {
                console.error("Error:", error.response.data.message);
                alert(error.response.data.message);
            } else if (error.request) {
                console.error("No response from server:", error.request);
                alert("Failed to connect to the server. Please try again later.");
            } else {
                console.error("Error setting up request:", error.message);
                alert("An unexpected error occurred. Please try again.");
            }
        }
        return null
    }
}

async function addAppointment(data) { //sudah update
    if (data.request.method === "POST") {
        const formData = await data.request.formData();
        const newAppointment = Object.fromEntries(formData);

        try {
            
            const getIndexResponse = await axios.get('http://localhost:3000/api/patient/allappointment');
            const count = getIndexResponse.data.count; 

            newAppointment.index = count + 1; 
            newAppointment.patientName = loggedUser[0].name;
            newAppointment.solution = "-";
            newAppointment.status = "-";
            newAppointment.medicines = [];

            alert(`New Appointment Index: ${newAppointment.index}`);

            const response = await axios.post('http://localhost:3000/api/patient/', newAppointment);
            alert("Appointment is successfully added");

            return redirect("/patient");
        } catch (error) {
            console.error("Error posting appointment:", error.message);
            alert("Failed to add appointment. Check console for details.");

            return null; 
        }
    }
}


async function loadAppointmentDokter() { //sudah update
    try {
        const response = await axios.get('http://localhost:3000/api/doctor/appointment', {
            params: { name: loggedUser[0].name },
        });
        return response.data;
    } catch (error) {
        console.error("Error loading doctor appointments:", error.message);
        alert("Failed to load doctor appointments. Please try again.");
        return [];
    }
}

async function loadAppointmentPasien() { //sudah update
    try {
        const response = await axios.get('http://localhost:3000/api/patient/appointment', {
            params: { username: loggedUser[0].name },
        });
        return response.data;
    } catch (error) {
        console.error("Error loading patient appointments:", error.message);
        alert("Failed to load patient appointments. Please try again.");
        return [];
    }
}


async function pickAppointment(data) { // sudah update
    if (data.request.method === "POST") {
        const formData = await data.request.formData();
        const selectedIndex = formData.get("selectedIndex"); 
        const appointmentIndex = parseInt(selectedIndex, 10);
        const response = await axios.get('http://localhost:3000/api/doctor/appointmentselect', {
            params: { index: appointmentIndex },
        });       
        selectedConsult.pop();
        selectedConsult.push(response.data);

        return redirect("/doctor/consult");
    }
}

function loadSelectedAppointment(){ // gak perlu update
    return selectedConsult
}

async function giveConsult(data) {
    if (data.request.method === "PUT") {
        const formData = await data.request.formData();
        const finishedConsult = Object.fromEntries(formData);

        // Parse the medicines if it's a string (from the frontend)
        let medicines = finishedConsult.medicines;
        
        if (typeof medicines === 'string') {
            try {
                medicines = JSON.parse(medicines); // Parse the JSON string into an array of objects
            } catch (error) {
                console.error("Error parsing medicines:", error);
                alert("Failed to parse medicines. Check console for details.");
                return null;
            }
        }

        finishedConsult.status = "Done"; // Set the status

        try {
            // Send the data to the backend with medicines included in the payload
            const response = await axios.put('http://localhost:3000/api/doctor/appointmentselect/giveconsult',
                { ...finishedConsult, medicines }, // Include medicines in the payload
                { params: { index: finishedConsult.index } } // Include the index as a query parameter
            );

            console.log("Updated Appointment:", response.data);
            alert("Consultation updated successfully");

            return redirect("/doctor"); // Redirect after successful update
        } catch (error) {
            console.error("Error updating consultation:", error.message);
            alert("Failed to update consultation. Check console for details.");

            return null;
        }
    }
}

async function loadMedicine() { //sudah update
    const response = await axios.get('http://localhost:3000/api/admin');
    return response.data;
}

async function addMedicine(data) { //sudah update
    if (data.request.method === "POST") {
        const formData = await data.request.formData();
        const newMedicine = Object.fromEntries(formData);
        alert("change menu to see the result")
        try {
            const response = await axios.post('http://localhost:3000/api/admin/', newMedicine);

            return redirect("/admin/medicine");
        } catch (error) {
            console.error("Error posting medicine:", error.message);
            alert("Failed to add medicine. Check console for details.");

            return null; 
        }
    }
    return null;
}

async function editMedicine(data){
    if (data.request.method === "PUT") {
        const formData = await data.request.formData();
        const updatedMedicine = Object.fromEntries(formData);
        try {
            const response = await axios.put('http://localhost:3000/api/admin/medicine/edit', updatedMedicine, {
                params: { code: updatedMedicine.code }, 
            });
            console.log(response)
            return redirect("/admin/medicine");
        } catch (error) {
            console.error("Error posting medicine:", error.message);
            alert("Failed to add medicine. Check console for details.");

            return null; 
        }
    }
}


export default { loadUserList, loadDoctorList, registerUser, loginUser, addAppointment,
                 loadAppointmentDokter, loadAppointmentPasien, pickAppointment, loadSelectedAppointment, 
                 giveConsult, loadMedicine, addMedicine, editMedicine };
