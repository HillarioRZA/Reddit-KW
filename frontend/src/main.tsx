import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider, Navigate} from 'react-router-dom';
import Login from './pages/login.jsx';
import Register from './pages/register.jsx';
import dataHandler from './assets/dataHandler.jsx';

const { loadUserList, loadDoctorList, registerUser, loginUser, addAppointment, 
  loadAppointmentDokter, loadAppointmentPasien, pickAppointment, loadSelectedAppointment, 
  giveConsult, loadMedicine, addMedicine, editMedicine } = dataHandler

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },  
      {
        path: "/login",
        element: <Login />,
        action: loginUser
      },
      {
        path: "/register",
        element: <Register />,
        action: registerUser,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
