import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { removeTokens } from "../../../utils/Auth";
import { resetAxios } from "../../../utils/AxiosConfig";
import { useUser } from "../../../contexts/UserContext";
import { Icon } from "../../atoms/Icon/Icon";
import { Text } from "../../atoms/Text/Text";
import { Button } from "../../atoms/Button/Button";

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
            <Icon variant="user" size="sm" className="me-2" />
            <Text variant="caption">Ver perfil</Text>
          </Link>
        </li>
        <li>
          <Link className="dropdown-item py-2 px-3" to="/profile/edit" onClick={onClose}>
            <Icon variant="edit" size="sm" className="me-2" />
            <Text variant="caption">Editar perfil</Text>
          </Link>
        </li>
        <li>
          <Link className="dropdown-item py-2 px-3" to="/profile/vocational-history" onClick={onClose}>
            <Icon variant="clipboard" size="sm" className="me-2" />
            <Text variant="caption">Mi historial vocacional</Text>
          </Link>
        </li>
        <li>
          <Link className="dropdown-item py-2 px-3" to="/profile/favorites" onClick={onClose}>
            <Icon variant="heart" size="sm" className="me-2" />
            <Text variant="caption">Mis favoritos</Text>
          </Link>
        </li>
        <li>
          <Link className="dropdown-item py-2 px-3" to="/profile/notifications" onClick={onClose}>
            <Icon variant="bell" size="sm" className="me-2" />
            <Text variant="caption">Mis notificaciones</Text>
          </Link>
        </li>
        <li>
          <Link className="dropdown-item py-2 px-3" to="/profile/settings" onClick={onClose}>
            <Icon variant="settings" size="sm" className="me-2" />
            <Text variant="caption">Configuraciones</Text>
          </Link>
        </li>
        <li>
          <Link className="dropdown-item py-2 px-3" to="/help" onClick={onClose}>
            <Icon variant="help" size="sm" className="me-2" />
            <Text variant="caption">Ayuda y soporte</Text>
          </Link>
        </li>
        <li><hr className="dropdown-divider my-2" /></li>
        <li>
          <Button
            variant="link"
            className="dropdown-item py-2 px-3"
            onClick={handleLogout}
            style={{ width: "100%", textAlign: "left" }}
          >
            <Icon variant="logout" size="sm" className="me-2" />
            <Text variant="caption">Cerrar sesión</Text>
          </Button>
        </li>
      </ul>
    </div>
  );
}