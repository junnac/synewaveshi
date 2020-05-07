import React, { useState } from 'react';

const Home = ({ updateUsername }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username) {
      updateUsername(username);
    } else {
      alert('Please enter a valid alphabetical name.')
    }
  };

  const changeUsername = (e) => setUsername(e.target.value);

  return (
    <>
      <h1>syne waves hi</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={changeUsername}
          placeholder="Enter your name to wave back."
        />
      </form>
    </>
  );
};

export default Home;
