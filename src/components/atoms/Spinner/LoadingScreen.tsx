import React from "react";
import { Spinner } from "./Spinner";

interface LoadingScreenProps {
  text?: string;
  minHeight?: string;
  variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  text = "Cargando...",
  minHeight = "100vh",
  variant = "primary",
}) => {
  return (
    <div 
      className="d-flex justify-content-center align-items-center" 
      style={{ minHeight }}
    >
      <div className="text-center">
        <Spinner size="lg" variant={variant} />
        <div className={`mt-3 text-${variant}`}>
          {text}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;