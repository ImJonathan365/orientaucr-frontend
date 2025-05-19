import LoginSection from "../../components/organisms/LoginSection/LoginSection";

export const Login = () => {

  const handleForgotPassword = () => {
    console.log("Redirigiendo a recuperación de contraseña...");
  };

  return (
    <LoginSection
      onForgotPassword={handleForgotPassword}
    />
  );
};