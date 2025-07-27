import { useQuery } from '@tanstack/react-query'; // ✅ Required import
import { getAuthUser } from '../lib/api';

const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ['authUser'],
    queryFn: getAuthUser,
    retry: false, // Disable automatic retries
  });

  return {
    isLoading: authUser.isLoading,
    authUser: authUser?.data,
  };
};

export default useAuthUser;

