import { loggedUser, selectedConsult } from "../user.json";
import { redirect } from "react-router-dom";
import axios from "axios";

// Type Definitions
interface DataRequest {
  request: {
    method: string;
    formData: () => Promise<FormData>;
  };
}

interface User {
  username: string;
  password: string;
  name?: string;
  role?: string;
}

interface Appointment {
  index: number;
  patientName: string;
  solution: string;
  status: string;
  medicines: string[];
  [key: string]: any; // For additional fields
}

interface Medicine {
  code: string;
  name: string;
  [key: string]: any;
}

// Functions
async function loadUserList(): Promise<any> {
  const response = await axios.get('http://localhost:3000/api/admin/user');
  return response.data;
}

async function loadDoctorList(): Promise<any> {
  const response = await axios.get('http://localhost:3000/api/doctor');
  return response.data;
}

async function registerUser(data: DataRequest): Promise<void | ReturnType<typeof redirect>> {
  if (data.request.method === "POST") {
    const formData = await data.request.formData();
    const newUser = Object.fromEntries(formData) as User;

    try {
      await axios.post('http://localhost:3000/api/user/register', newUser);
      alert("User is successfully added");
      return redirect("/login");
    } catch (error: any) {
      handleAxiosError(error);
    }
  }
}

async function loginUser(data: DataRequest): Promise<void | ReturnType<typeof redirect>> {
  if (data.request.method === "POST") {
    const formData = await data.request.formData();
    const userLogged = Object.fromEntries(formData) as User;

    if (userLogged.username === "admin" && userLogged.password === "admin") {
      loggedUser.pop();
      loggedUser.push({ username: "admin", password: "admin" });
      return redirect("/admin");
    }

    try {
      const response = await axios.post('http://localhost:3000/api/user/login', userLogged);
      const role = response.data.role === "Pasien" ? "Pasien" : "Dokter";
      alert("User is logged in");
      loggedUser.pop();
      loggedUser.push(response.data);
      return redirect(role === "Pasien" ? "/patient" : "/doctor");
    } catch (error: any) {
      handleAxiosError(error);
    }
  }
}

async function addAppointment(data: DataRequest): Promise<void | ReturnType<typeof redirect>> {
  if (data.request.method === "POST") {
    const formData = await data.request.formData();
    const newAppointment = Object.fromEntries(formData) as Partial<Appointment>;

    try {
      const { data: countData } = await axios.get<{ count: number }>('http://localhost:3000/api/patient/allappointment');
      newAppointment.index = countData.count + 1;
      newAppointment.patientName = loggedUser[0].name || "";
      newAppointment.solution = "-";
      newAppointment.status = "-";
      newAppointment.medicines = [];

      alert(`New Appointment Index: ${newAppointment.index}`);

      await axios.post('http://localhost:3000/api/patient/', newAppointment);
      alert("Appointment is successfully added");
      return redirect("/patient");
    } catch (error: any) {
      handleAxiosError(error);
    }
  }
}

async function loadAppointmentDokter(): Promise<any[]> {
  try {
    const response = await axios.get('http://localhost:3000/api/doctor/appointment', {
      params: { name: loggedUser[0]?.name },
    });
    return response.data;
  } catch (error: any) {
    handleAxiosError(error);
    return [];
  }
}

async function loadAppointmentPasien(): Promise<any[]> {
  try {
    const response = await axios.get('http://localhost:3000/api/patient/appointment', {
      params: { username: loggedUser[0]?.name },
    });
    return response.data;
  } catch (error: any) {
    handleAxiosError(error);
    return [];
  }
}

async function pickAppointment(data: DataRequest): Promise<ReturnType<typeof redirect>> {
  if (data.request.method === "POST") {
    const formData = await data.request.formData();
    const selectedIndex = formData.get("selectedIndex") as string;
    const appointmentIndex = parseInt(selectedIndex, 10);

    const response = await axios.get('http://localhost:3000/api/doctor/appointmentselect', {
      params: { index: appointmentIndex },
    });

    selectedConsult.pop();
    selectedConsult.push(response.data);

    return redirect("/doctor/consult");
  }
}

function loadSelectedAppointment(): any {
  return selectedConsult;
}

async function giveConsult(data: DataRequest): Promise<void | ReturnType<typeof redirect>> {
  if (data.request.method === "PUT") {
    const formData = await data.request.formData();
    const finishedConsult = Object.fromEntries(formData) as Partial<Appointment>;

    try {
      finishedConsult.status = "Done";
      finishedConsult.medicines = JSON.parse(finishedConsult.medicines as string) || [];

      await axios.put('http://localhost:3000/api/doctor/appointmentselect/giveconsult', finishedConsult, {
        params: { index: finishedConsult.index },
      });

      alert("Consultation updated successfully");
      return redirect("/doctor");
    } catch (error: any) {
      handleAxiosError(error);
    }
  }
}

async function loadMedicine(): Promise<any[]> {
  const response = await axios.get('http://localhost:3000/api/admin');
  return response.data;
}

async function addMedicine(data: DataRequest): Promise<ReturnType<typeof redirect>> {
  if (data.request.method === "POST") {
    const formData = await data.request.formData();
    const newMedicine = Object.fromEntries(formData) as Medicine;

    try {
      await axios.post('http://localhost:3000/api/admin/', newMedicine);
      alert("Change menu to see the result");
      return redirect("/admin/medicine");
    } catch (error: any) {
      handleAxiosError(error);
    }
  }
}

async function editMedicine(data: DataRequest): Promise<ReturnType<typeof redirect>> {
  if (data.request.method === "PUT") {
    const formData = await data.request.formData();
    const updatedMedicine = Object.fromEntries(formData) as Medicine;

    try {
      await axios.put('http://localhost:3000/api/admin/medicine/edit', updatedMedicine, {
        params: { code: updatedMedicine.code },
      });
      return redirect("/admin/medicine");
    } catch (error: any) {
      handleAxiosError(error);
    }
  }
}

// Error Handling Helper
function handleAxiosError(error: any): void {
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

export default {
  loadUserList,
  loadDoctorList,
  registerUser,
  loginUser,
  addAppointment,
  loadAppointmentDokter,
  loadAppointmentPasien,
  pickAppointment,
  loadSelectedAppointment,
  giveConsult,
  loadMedicine,
  addMedicine,
  editMedicine,
};
