import { useState, useRef, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { getUserProfileImage } from '../services/userService';

export const useHeaderState = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
          console.error('Error loading profile image:', error);
          setProfileImageUrl(null);
        }
      } else {
        setProfileImageUrl(null);
      }
    };

    loadProfileImage();
  }, [user?.userProfilePicture]);

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setProfileMenuOpen(false);
  };

  return {
    isMenuOpen,
    setIsMenuOpen,
    profileMenuOpen,
    setProfileMenuOpen,
    profileImageUrl,
    profileMenuRef,
    user,
    closeAllMenus
  };
};
