import { jwtDecode } from 'jwt-decode';

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decodedToken = jwtDecode(token);
    // console.log(decodedToken);
    const currentTime = Date.now() / 1000; // Current time in seconds
    return decodedToken.exp > currentTime; // Check if the token is expired
  } catch (error) {
    return false; // If there's an error decoding the token, consider the user not authenticated
  }
};


export default isAuthenticated;