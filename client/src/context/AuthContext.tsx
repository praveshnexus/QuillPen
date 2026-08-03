import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { User } from "../types/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: Dispatch<SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
});
