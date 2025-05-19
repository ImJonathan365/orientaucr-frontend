import LoginSection from "../../components/organisms/LoginSection/LoginSection";

export const Login = () => {

  const handleLogin = async (email: string, password: string) => {
    try {
      console.log("Iniciando sesión con:", email, password);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleForgotPassword = () => {
    console.log("Redirigiendo a recuperación de contraseña...");
  };

  return (
    <>
    <LoginSection onLogin={handleLogin}
                  onForgotPassword={handleForgotPassword}></LoginSection>
    </>
  );
};