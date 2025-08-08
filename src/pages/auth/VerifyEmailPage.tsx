import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail, setAuthToken } from "../../services/userService";
import { useUser } from "../../contexts/UserContext";
import { VerificationLoading, VerificationSuccess, VerificationError } from "../../components/organisms";

export const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState("");
  const hasVerifiedRef = useRef(false);
  const { refreshUser } = useUser();

  useEffect(() => {
    if (hasVerifiedRef.current) {
      return;
    }

    const token = searchParams.get('token');
    if (!token) {
      setVerificationStatus('error');
      setMessage("Token de verificación no encontrado.");
      setIsLoading(false);
      return;
    }

    const handleVerification = async () => {
      try {
        hasVerifiedRef.current = true;
        const response = await verifyEmail(token);
        
        setAuthToken(response.token);
        await refreshUser();
        
        setVerificationStatus('success');
        setMessage(response.message || "Correo verificado correctamente.");
        setTimeout(() => {
          navigate("/home");
        }, 3000);
      } catch (err: any) {
        setVerificationStatus('error');
        if (err.response?.status === 410) {
          setMessage("El enlace de verificación ha expirado. Por favor, regístrate nuevamente.");
        } else if (err.response?.status === 400) {
          setMessage("El enlace de verificación es inválido o está corrupto. Por favor, intenta nuevamente.");
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

  const handleGoToRegister = () => {
    navigate("/register");
  };

  const renderContent = () => {
    if (isLoading) {
      return <VerificationLoading />;
    }

    if (verificationStatus === 'success') {
      return (
        <VerificationSuccess
          message={message}
          onGoToHome={handleGoToHome}
        />
      );
    }

    return (
      <VerificationError
        message={message}
        onGoToLogin={handleGoToLogin}
        onGoToRegister={handleGoToRegister}
      />
    );
  };

  return (
    <div className="container d-flex justify-content-center align-items-center py-5" style={{ minHeight: "100vh" }}>
      <div className="card shadow-sm w-100" style={{ maxWidth: "500px" }}>
        <div className="card-body text-center">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
