import { Loader2 } from "lucide-react";
import clsx from "clsx";

const Loader = ({ className = "" }: { className?: string }) => {
  return (
    <div className="w-full h-full flex justify-center items-center mt-5">
      <Loader2 className={clsx("animate-spin", className)} size={25} />
    </div>
  );
};

export default Loader;
