import React, { useState } from 'react';
import Login from './Login/Login';
import Signup from './Signup/Signup';

function App() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div>
      {showLogin ? <Login /> : <Signup />}

      <div style={{ textAlign: 'center', marginTop: 20 }}>
        {showLogin ? (
          <>
            Don't have an account?{' '}
            <button onClick={() => setShowLogin(false)}>Signup</button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button onClick={() => setShowLogin(true)}>Login</button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
