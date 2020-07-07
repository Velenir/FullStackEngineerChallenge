import React from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

export interface LoginData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (data: LoginData) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, children }) => {
  const { register, handleSubmit, errors } = useForm<LoginData>();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: 'flex', flexDirection: 'column', width: 'fit-content' }}
    >
      <input
        type="email"
        name="email"
        placeholder="email"
        ref={register({ required: 'email is required' })}
      />
      <ErrorMessage name="email" errors={errors} />
      <input
        type="password"
        name="password"
        placeholder="password"
        ref={register({
          required: 'password is required',
          minLength: { value: 5, message: 'min 6 characters' },
        })}
      />
      <ErrorMessage name="password" errors={errors} />
      <button type="submit">Submit</button>
      {children}
    </form>
  );
};
