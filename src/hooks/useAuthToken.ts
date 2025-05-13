// hooks/useAuthToken.ts
import { useSession } from "next-auth/react";

const useAuthToken = (): string | null => {
  const { data } = useSession();

  if (typeof window !== "undefined") {
    return (data?.user as { token?: string })?.token || null;
  }

  return null;
};

export default useAuthToken;

