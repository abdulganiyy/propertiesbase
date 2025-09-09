import React, { FC } from "react";
import { Header } from "../shared/header";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: FC<AuthWrapperProps> = ({ children }) => {
  return (
    <div className="h-screen">
      <Header />
      <div className="overflow-y-auto flex justify-center items-center">
        <div className="min-w-80">{children}</div>
      </div>
    </div>
  );
};

export default AuthWrapper;
