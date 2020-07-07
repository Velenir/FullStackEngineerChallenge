let accessToken = '';

export const setAccessToken = (s: string) => {
  accessToken = s;
  console.log('accessToken', accessToken);
};

export const getAccessToken = () => {
  return accessToken;
};
