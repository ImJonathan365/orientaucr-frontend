import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitted(false);

    // Aquí deberías llamar a tu servicio para enviar el correo de recuperación
    try {
      // await sendPasswordResetEmail(email); // Implementa este servicio en el backend
      setSubmitted(true);
    } catch (err: any) {
      setError("No se pudo enviar el correo de recuperación. Intente de nuevo.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Recuperar contraseña</h2>
        {submitted ? (
          <div className="alert alert-success" role="alert">
            Si el correo está registrado, recibirá instrucciones para restablecer su contraseña.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Correo electrónico:
              </label>
              <input
                id="email"
                type="email"
                className="form-control"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="alert alert-danger py-1" role="alert">
                {error}
              </div>
            )}
            <button type="submit" className="btn btn-primary w-100 mb-3">
              Enviar instrucciones
            </button>
          </form>
        )}
        <div className="text-center">
          <Link to="/login">Volver al inicio de sesión</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;