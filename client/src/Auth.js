import axios from "axios";

const Auth = {
  login: user => {
    localStorage.setItem('user', JSON.stringify(user));
    axios.defaults.headers.common['Authorization'] = user.token;
  },

  init: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    axios.defaults.headers.common['Authorization'] = user ? user.token : '';
  },

  auth: () => {
    return localStorage.getItem('user') !== null;
  },
  
  guest: () => {
    return localStorage.getItem('user') === null || localStorage.getItem('user') === 'undefined';
  },

  logout: () => {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('user');
    return;
  },

  getToken: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.token : '';
  },

  setUser: (updatedUser) => {
    const user = JSON.parse(localStorage.getItem('user'));
    updatedUser.token = user.token;

    localStorage.setItem('user', JSON.stringify(updatedUser)); 
  }
}

export default Auth;