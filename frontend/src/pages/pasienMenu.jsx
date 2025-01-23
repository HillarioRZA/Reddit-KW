import { Outlet } from 'react-router-dom'
import '../App.jsx'
import { NavLink } from "react-router-dom";

function PasienMenu() {

  return (
    <div>
        <NavLink
            className={(state) => {
            return state.isActive ? "text-blue-400" : "text-black" + " px-2 py-1";
            }}
            to=""
        ><button>Main</button></NavLink>
        <NavLink
            className={(state) => {
            return state.isActive ? "text-blue-400" : "text-black" + " px-2 py-1";
            }}
            to="list"
        ><button>Appointment</button></NavLink>
        <NavLink
        className={(state) => {
          return state.isActive ? "text-blue-400" : "text-black" + " px-2 py-1";
        }}
        to="/login"
      ><button>Log Out</button></NavLink>
      <Outlet></Outlet>
    </div>
  )
}

export default PasienMenu
