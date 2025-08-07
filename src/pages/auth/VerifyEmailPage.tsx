import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail, setAuthToken } from "../../services/userService";
import { useUser } from "../../contexts/UserContext";

export const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState("");
  const { refreshUser } = useUser();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setVerificationStatus('error');
      setMessage("Token de verificación no encontrado.");
      setIsLoading(false);
      return;
    }

    const handleVerification = async () => {
      try {
        const response = await verifyEmail(token);
        setAuthToken(response.token);
        await refreshUser();
        setVerificationStatus('success');
        setMessage(response.message);
        
        // Auto-redirect after 3 seconds
        setTimeout(() => {
          navigate("/home");
        }, 3000);
        
      } catch (err: any) {
        setVerificationStatus('error');
        if (err.response?.status === 410) {
          setMessage("El enlace de verificación ha expirado y tu registro ha sido eliminado. Por favor, regístrate nuevamente.");
        } else if (err.response?.status === 400) {
          setMessage("El enlace de verificación es inválido. Por favor, verifica que hayas copiado la URL completa.");
        } else {
          const errorMsg = err.response?.data || err.message || "Error al verificar el correo";
          setMessage(errorMsg);
        }
      } finally {
        setIsLoading(false);
      }
    };

    handleVerification();
  }, [searchParams, navigate, refreshUser]);

  const handleGoToLogin = () => {
    navigate("/login");
  };

  const handleGoToHome = () => {
    navigate("/home");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center py-5" style={{ minHeight: "100vh" }}>
      <div className="card shadow-sm w-100" style={{ maxWidth: "500px" }}>
        <div className="card-body text-center">
          {isLoading ? (
            <>
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Verificando...</span>
              </div>
              <h3 className="mb-3">Verificando tu correo electrónico</h3>
              <p className="text-muted">Por favor espera mientras verificamos tu cuenta...</p>
            </>
          ) : (
            <>
              {verificationStatus === 'success' ? (
                <>
                  <i className="bi bi-check-circle-fill text-success fs-1 mb-3 d-block"></i>
                  <h2 className="text-success mb-3">¡Verificación Exitosa!</h2>
                  <div className="alert alert-success">
                    <p className="mb-0">{message}</p>
                  </div>
                  <p className="text-muted mb-4">
                    Tu cuenta ha sido verificada correctamente. Serás redirigido automáticamente en unos segundos.
                  </p>
                  <button
                    className="btn btn-primary w-100"
                    onClick={handleGoToHome}
                  >
                    Ir al Dashboard
                  </button>
                </>
              ) : (
                <>
                  <i className="bi bi-x-circle-fill text-danger fs-1 mb-3 d-block"></i>
                  <h2 className="text-danger mb-3">Error de Verificación</h2>
                  <div className="alert alert-danger">
                    <p className="mb-0">{message}</p>
                  </div>
                  <p className="text-muted mb-4">
                    {message.includes("expirado") 
                      ? "Tu registro anterior ha sido eliminado por seguridad. Puedes registrarte nuevamente."
                      : "El enlace de verificación puede haber expirado o ser inválido."
                    }
                  </p>
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={handleGoToLogin}
                    >
                      Ir al Login
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => navigate("/register")}
                    >
                      Registrarse de nuevo
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
