import logo from "@/assets/Logo.svg";
import { ReactNode } from "react";
const AuthLayout = ({ component }: { component: ReactNode }) => {
  return (
    <div className="w-full sm:h-dvh md:h-screen grid grid-cols-12">
      <div className="hidden md:flex col-span-5 h-full justify-center items-center bg-white">
        <div className="w-[90%] flex flex-col items-center">
          <p className="text-center text-3xl font-semibold text-black">
            <span>Welcome to</span>
            <span className="text-themeBlue font-semibold">
              {" "}
              Social Network!
            </span>
          </p>
          <img alt="Logo" src={logo} height={400} width={400} />

          <p className="text-base text-center font-medium text-black">
            Connect, share, and have fun with friends and new faces. Let the
            good times roll!
          </p>
        </div>
      </div>
      <div className="bg-bgGray col-span-12 md:col-span-7 h-full">
        {component}
      </div>
    </div>
  );
};

export default AuthLayout;
