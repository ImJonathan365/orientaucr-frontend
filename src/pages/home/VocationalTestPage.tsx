import { useUser } from "../../contexts/UserContext";
import { Button } from "../../components/atoms/Button/Button";
import { useNavigate } from "react-router-dom";
import { removeTokens } from "../../utils/Auth";

export const VocationalTestPage = () => {
  const { user: currentUser } = useUser();
  const navigate = useNavigate();

  const handleStart = () => {
    if (currentUser) {
      navigate("/test");
    } else {
      removeTokens();
      navigate("/login");
    }
  };

  return (
    <>
      <div className="container py-5 text-center">
        <h1 className="text-center">Test Vocacional</h1>
        <p className="text-center">
          Descubre tus intereses y habilidades con nuestro Test Vocacional. Responde unas breves preguntas y obtén recomendaciones para tu futuro académico y profesional.
          <br />
          ¡Da el primer paso hacia tu vocación ideal!
        </p>
        <Button variant="primary" onClick={handleStart}>
          Comenzar Test
        </Button>
      </div>
    </>
  );
}