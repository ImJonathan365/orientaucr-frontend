import React from "react";
import { Link } from "react-router-dom";


interface ProfileDropdownProps {
  onClose: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onClose }) => (
  <div className="profile-dropdown">
    <ul className="list-unstyled mb-0">
      <li>
        <Link className="dropdown-item py-2 px-3" to="/profile" onClick={onClose}>
          Ver perfil
        </Link>
      </li>
      <li>
        <button
          className="dropdown-item py-2 px-3"
          style={{ background: "none", border: "none", width: "100%", textAlign: "left" }}
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          Cerrar sesión
        </button>
      </li>
    </ul>
  </div>
);