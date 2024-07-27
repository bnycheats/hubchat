import { AuthContext,  type AuthContextValue  } from "@/context/auth-provider";
import { useContext} from "react";
 
export default function useAuth() {
  return useContext(AuthContext) as AuthContextValue;
}
