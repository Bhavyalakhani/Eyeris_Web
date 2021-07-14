import React, { createContext, useState, useEffect } from 'react';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('user'));

  useEffect(() => {
    let token = localStorage.getItem('eyerisToken');
    if (token) {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', 'Bearer ' + token);
      myHeaders.append('Cookie', 'token=' + token);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };
      fetch(process.env.REACT_APP_BACKEND_API_URL + 'user/me', requestOptions)
        .then((response) => response.text())
        .then((result) => {
          result = JSON.parse(result);
          result['token'] = token;
          if (result._id !== undefined && result._id !== null && result._id) {
            // setIsLoggedIn(true);
            if (!result.cart) {
              result.cart = [];
            }
            console.log(result);
            setCurrentUser(result);
          } else {
            setCurrentUser(null);
            console.log('No user');
            localStorage.removeItem('eyerisToken');
          }
        })
        .catch((error) => console.log('error', error));
    } else {
      setCurrentUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser: currentUser,
        setCurrentUser: setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
