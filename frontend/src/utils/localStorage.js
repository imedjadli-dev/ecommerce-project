export const getUserFromLocalStorage = () => {
      const user = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user'))
        : null;
      return user;
    };
    