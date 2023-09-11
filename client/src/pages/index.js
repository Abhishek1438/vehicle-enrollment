import React, { useState } from 'react';
import classes from '../styles/Home.module.css';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/authSlice';

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [email, setEmail] = useState(''); // Use email instead of username
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async () => {
    // Send a POST request to the server to authenticate the user
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Use email field
      });

      if (response.ok) {
        const user = await response.json();

        dispatch(setUser(user));
        // Redirect the user to the appropriate dashboard based on their role (admin or customer)
        if (user.role === 'admin') {
          // Redirect to admin dashboard
          router.push('/admin');
        } else {
          // Redirect to customer dashboard
          router.push('/customer');
        }
      } else {
        // Handle authentication error
        setError(true);
        setEmail('');
        setPassword('');
        console.error('Authentication failed.');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className={classes.homeContainer}>
      <div className={classes.backgroundImage}></div>
      <h1 className={classes.title}>Welcome to the Vehicle Enrollment System</h1>
      <div className={classes.form}>
        <h2>Welcome Back</h2>
        <input
          type="email" // Use type="email" for email input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className={classes.error}>Wrong email or password</p>}
        <button onClick={handleLogin} className={classes.loginButton}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
