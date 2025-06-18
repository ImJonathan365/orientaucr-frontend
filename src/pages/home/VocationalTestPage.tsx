import { Link } from "react-router-dom";
import { Icon } from "../../components/atoms/Icon/Icon";
import { useState, useEffect } from "react";
import { User } from "../../types/userType";
import { getCurrentUser } from "../../services/userService";

export const VocationalTestPage = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch {
        setCurrentUser(null);
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <h1 className="text-center">Test Vocacional</h1>
      <p className="text-center">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur necessitatibus dolorem cupiditate omnis. Sunt incidunt ullam fugit beatae asperiores consectetur praesentium veritatis possimus temporibus, amet repudiandae, nemo cupiditate alias minus.</p>
      <center>
        <Link
          style={{ backgroundColor: "#4bc0e1", color: "#fff", border: "none" }}
          className="btn btn-success" to={currentUser ? "/test" : "/register"}>
          <Icon variant="play" size="xl" />
          Comenzar Test
        </Link>
      </center>
    </>
  );
}