import React from 'react';

const CurrentUsersList = ({ users }) => (
  <>
    {users.map(({ id, username }, i) => {
      let name = username;

      if (users.length === 2 && i === 1) {
        name = ` and ${username}.`;
      } else if (i !== 0) {
        i < users.length - 1
          ? (name = `, ${username}`)
          : (name = `, and ${username}.`);
      }

      return <span key={id}>{name}</span>;
    })}
  </>
);

export default CurrentUsersList;
