import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Button } from "../../components/atoms/Button/Button";
import { Icon } from "../../components/atoms/Icon/Icon";

export const SimulationExamStartPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/simulation-exam");
  };

  const handleBack = () => {
    navigate("/home");
  };

  return (
    <div className="container py-5 text-center">
      <h2>¿Listo para iniciar el examen simulado?</h2>
      <p>
        El examen consta de 30 preguntas.<br />
        Tendrás 2 horas para completarlo. Una vez iniciado, el tiempo no se detendrá.<br />
        ¿Deseas comenzar ahora?
      </p>
      <div className="d-flex justify-content-center gap-3 mt-4">
        <Button variant="secondary" onClick={handleBack}>
          <Icon variant="home" className="me-2" />
          Regresar
        </Button>
        <Button variant="primary" onClick={handleStart}>
          Iniciar examen
        </Button>
      </div>
    </div>
  );
};