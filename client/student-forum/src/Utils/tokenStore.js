export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const setTokens = ({ access, refresh }) => {
  if (access?.token) localStorage.setItem("accessToken", access.token);
  if (refresh?.token) localStorage.setItem("refreshToken", refresh.token);
};

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};
