export const validateUsername = (
  username: string,
  regex: RegExp,
  errorMessage: string
) => {
  const valid = regex.test(username);
  if (!valid) {
    return {
      username: errorMessage,
    };
  }

  return null;
};
