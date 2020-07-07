import React from 'react';

export const Form: React.FC<React.FormHTMLAttributes<HTMLFormElement>> = ({
  children,
  ...formProps
}) => {
  return (
    <>
      <form {...formProps}>{children}</form>
      <style jsx>{`
        form {
          display: flex;
          flex-direction: column;
          width: fit-content;
        }

        form > :global(*) {
          margin: 0.5em 0;
        }
      `}</style>
    </>
  );
};
