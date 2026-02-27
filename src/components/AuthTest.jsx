import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const AuthTest = () => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar usuario actual
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        console.log('getUser result:', { user, error });
        setUser(user);
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('getSession result:', { session, sessionError });
        setSession(session);
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session);
        setUser(session?.user || null);
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'validator@example.com',
        password: 'validator123'
      });
      
      if (error) {
        console.error('Sign in error:', error);
        alert('Error al iniciar sesión: ' + error.message);
      } else {
        console.log('Sign in success:', data);
        alert('Sesión iniciada correctamente');
      }
    } catch (error) {
      console.error('Sign in exception:', error);
      alert('Excepción al iniciar sesión: ' + error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        alert('Error al cerrar sesión: ' + error.message);
      } else {
        console.log('Sign out success');
        alert('Sesión cerrada correctamente');
      }
    } catch (error) {
      console.error('Sign out exception:', error);
      alert('Excepción al cerrar sesión: ' + error.message);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Estado de Autenticación</h3>
      
      <div className="space-y-2 mb-4">
        <div><strong>Usuario:</strong> {user ? 'Autenticado' : 'No autenticado'}</div>
        <div><strong>Email:</strong> {user?.email || 'N/A'}</div>
        <div><strong>ID:</strong> {user?.id || 'N/A'}</div>
        <div><strong>Sesión:</strong> {session ? 'Activa' : 'Inactiva'}</div>
      </div>

      <div className="space-x-2">
        <button
          onClick={handleSignIn}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Iniciar Sesión (Test)
        </button>
        
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>Credenciales de prueba:</p>
        <p>Email: validator@example.com</p>
        <p>Password: validator123</p>
      </div>
    </div>
  );
};

export default AuthTest;




