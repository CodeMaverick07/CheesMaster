import React, { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { validateToken } from "@/api/user"; // Adjust the import path as necessary
import { useSetRecoilState } from "recoil";
import { userAtom } from "@/Store/atoms/user";

const ProtectedPage = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const setUserAtom = useSetRecoilState(userAtom);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await validateToken();
        if (res.success) {
          setUserAtom(res.user);
        } else if (!res.success) {
          navigate("/auth/login");
        }
      } catch (error) {
        console.error("Error validating token:", error);
        navigate("/auth/login");
      }
    };
    checkToken();
  }, []);

  return <div>{children}</div>;
};

export default ProtectedPage;
