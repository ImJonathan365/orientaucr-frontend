 import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
export const SimulationExamStartPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/simulation-exam");
  };
  return (
    <div className="container py-5 text-center">
      <h2>¿Listo para iniciar el examen simulado?</h2>
      <p>
        El examen consta de 30 preguntas (15 de lógica verbal y 15 de lógica matemática).<br />
        Tendrás 2 horas para completarlo. Una vez iniciado, el tiempo no se detendrá.<br />
        ¿Deseas comenzar ahora?
      </p>
      <button className="btn btn-primary btn-lg" onClick={handleStart}>
        Iniciar examen
      </button>
    </div>
  );
};