import React from 'react';
import { useParams } from 'react-router-dom';

const Login = () => {
  const { role } = useParams();

  return (
    <div>
      <h1>{`Login as ${role}`}</h1>
      {/* Add your login form here */}
    </div>
  );
};

export default Login;
