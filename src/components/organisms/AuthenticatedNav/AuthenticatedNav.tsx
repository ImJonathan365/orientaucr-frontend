import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../../atoms/Icon/Icon';
import { ProfileDropdown } from '../../molecules/ProfileDropdown/ProfileDropdown';
import { useUser } from '../../../contexts/UserContext';
import { getUserProfileImage } from '../../../services/userService';

interface AuthenticatedNavProps {
  onMenuClose?: () => void;
}

export const AuthenticatedNav: React.FC<AuthenticatedNavProps> = ({
  onMenuClose
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    }

    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuOpen]);

  useEffect(() => {
    const loadProfileImage = async () => {
      if (user?.userProfilePicture) {
        try {
          const imageUrl = await getUserProfileImage(user.userProfilePicture);
          setProfileImageUrl(imageUrl);
        } catch (error) {
          setProfileImageUrl(null);
        }
      } else {
        setProfileImageUrl(null);
      }
    };

    loadProfileImage();
  }, [user?.userProfilePicture]);

  const handleProfileMenuToggle = () => {
    setProfileMenuOpen(prev => !prev);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuOpen(false);
    if (onMenuClose) {
      onMenuClose();
    }
  };

  return (
    <div className="nav-item position-relative ms-lg-3">
      <div ref={profileMenuRef} style={{ position: "relative" }}>
        <button
          className="profile-button"
          onClick={handleProfileMenuToggle}
          type="button"
          aria-expanded={profileMenuOpen}
          aria-haspopup="true"
        >
          {profileImageUrl ? (
            <img 
              src={profileImageUrl} 
              alt="Perfil" 
              className="profile-image"
            />
          ) : (
            <Icon variant="user" className="profile-icon" />
          )}
        </button>
        {profileMenuOpen && (
          <ProfileDropdown onClose={handleProfileMenuClose} />
        )}
      </div>
    </div>
  );
};
