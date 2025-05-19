export interface User {
    id: string;
    name: string;
    email: string;
    // otros campos necesarios
}

export async function loginUser(email: string, password: string): Promise<User> {
    /*  const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
    
      if (!response.ok) {
        throw new Error("Credenciales incorrectas");
      }
    
      const data = await response.json();
      // Guarda el token si tu backend lo retorna
      if (data.token) {
        localStorage.setItem("token", data.token);
      }*/
    const fakeUser: User = {
        id: "1",
        name: "Juan Pérez",
        email: "juan@gmail.com",
        // agrega aquí otros campos si es necesario
    };
    localStorage.setItem("token", "fake-token");
    return fakeUser;
}