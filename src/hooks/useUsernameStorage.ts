import usePersistedState from './usePersistedState';

export const useUsernameStorage = (defaultName: string = 'User') => {
  const [username, setUsername] = usePersistedState<string>(
    "username",
    defaultName,
    {
      onError: (error) => console.error("Username storage error:", error)
    }
  );

  return {
    username,
    setUsername
  };
};

export default useUsernameStorage; 