import React from 'react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'

export interface AddUserData {
  email: string
  password: string
  firstName: string
  lastName: string
}

interface AddUserFormProps {
  onSubmit: (data: AddUserData) => void
}

export const AddUserForm: React.FC<AddUserFormProps> = ({ onSubmit, children }) => {

  const { register, handleSubmit, errors } = useForm<AddUserData>()

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', width: 'fit-content' }}>
      <input type="email" name="email" placeholder="email" ref={register({ required: "email is required" })} />
      <ErrorMessage name="email" errors={errors} />
      <input type="text" name="firstName" placeholder="First name" ref={register({ required: "first name is required" })} />
      <ErrorMessage name="firstName" errors={errors} />
      <input type="text" name="lastName" placeholder="Last name" ref={register({ required: "last name is required" })} />
      <ErrorMessage name="lastName" errors={errors} />
      <input type="password" name="password" placeholder="password" ref={register({ required: 'password is required', minLength: { value: 6, message: 'min 6 characters' } })} />
      <ErrorMessage name="password" errors={errors} />
      <button type="submit">Submit</button>
      {children}
    </form>
  )

}