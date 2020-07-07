import React from 'react';
import { USER_ROLE } from 'server/consts';
import { MeQuery } from '../generated/graphql';
import { DataTypeFromQuery } from 'client/types';

const rolesMap = {
  [USER_ROLE.ADMIN]: 'admin',
  [USER_ROLE.EMPLOYEE]: 'employee',
};

const displayRole = (role: USER_ROLE) => {
  return rolesMap[role] || 'unknown';
};

interface ProfileProps {
  user: DataTypeFromQuery<MeQuery['me']>;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  return (
    <>
      <h3>Profile</h3>
      <div>
        <label>
          <strong>Name: </strong>
          <span>
            {user.firstName} {user.lastName}
          </span>
        </label>
        <label>
          <strong>Email: </strong>
          <span>{user.email}</span>
        </label>
        <label>
          <strong>Role: </strong>
          <span>{displayRole(user.role)}</span>
        </label>
      </div>
      <style jsx>{`
        div {
          display: flex;
          flex-direction: column;
          font-size: 2em;
        }
      `}</style>
    </>
  );
};
