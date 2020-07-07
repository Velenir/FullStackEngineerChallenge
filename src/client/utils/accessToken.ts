let accessToken = '';

// simple in-memory token
// if need to access more often, could put into global state/ React.Provider
export const setAccessToken = (s: string) => {
  accessToken = s;
};

export const getAccessToken = () => {
  return accessToken;
};
