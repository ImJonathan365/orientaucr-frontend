import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { removeTokens } from "../../../utils/Auth";
import { resetAxios } from "../../../utils/AxiosConfig";
import { useUser } from "../../../contexts/UserContext";

interface ProfileDropdownProps {
  onClose: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { refreshUser } = useUser();

  const handleLogout = async () => {
    removeTokens();
    resetAxios();
    await refreshUser();
    navigate("/login", { replace: true });
  };

  return (
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
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </li>
      </ul>
    </div>
  );
}