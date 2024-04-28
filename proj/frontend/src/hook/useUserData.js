import { useState, useEffect } from 'react';

const useUserData = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userDataString = localStorage.getItem('user');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUser(userData);
    }
  }, []);

  return user;
};

export default useUserData;
