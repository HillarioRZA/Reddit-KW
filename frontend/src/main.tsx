import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider, Navigate} from 'react-router-dom';
import AdminMenu from './pages/adminMenu.jsx';
import Admin from './pages/admin.jsx';
import AdminMedicine from './pages/adminMedicine.jsx';
import AdminEdit from './pages/adminEdit.jsx';
import Login from './pages/login.js';
import Register from './pages/register.js';
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
        path: "/admin",
        element: <AdminMenu />,
        children:[
          {
            index: true,
            element: <Admin/>,
            loader: loadUserList,
          },
          {
            path: "medicine",
            element: <AdminMedicine/>,
            loader: loadMedicine,
            action: addMedicine
          },
          {
            path: "edit",
            element: <AdminEdit/>,
            action: editMedicine
          }
        ]
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
      <RouterProvider router={router} />
  </StrictMode>,
)
