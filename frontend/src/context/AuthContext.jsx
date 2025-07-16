import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            setAccessToken(token);
        }
    }, []);

    useEffect(() => {
        if (accessToken) {
            localStorage.setItem('access_token', accessToken);
        } else {
            localStorage.removeItem('access_token');
        }
    }, [accessToken]);

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
