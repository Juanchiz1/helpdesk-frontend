import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const rol = localStorage.getItem('rol');
    return token ? { token, email, rol } : null;
  });

  const iniciarSesion = (datos) => {
    localStorage.setItem('token', datos.token);
    localStorage.setItem('email', datos.email);
    localStorage.setItem('rol', datos.rol);
    setUsuario(datos);
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('rol');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}