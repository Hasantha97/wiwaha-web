import React, { useEffect, useState, useContext } from "react";
import { Outlet } from 'react-router';
import { AuthContext } from './context/AuthContext';
import { auth } from './utils/firebase';
import Header from "./components/Header";
import './App.css';


function App() {
    const [user, setUser] = useState(useContext(AuthContext));
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
          setUser(user);
          setAuthLoading(false);
      });
      return () => unsubscribe();
    }, []);

  return (
    <AuthContext.Provider value={{ user, authLoading }}>
        <div className="app">
          <Header />
          <div className="app-body">
            <Outlet />
          </div>
        </div>
    </AuthContext.Provider>
  )
}

export default App;
