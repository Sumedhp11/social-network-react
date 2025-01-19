import { Loader2 } from "lucide-react";
const Loader = () => {
  return (
    <div className="w-full h-full flex justify-center items-center mt-5">
      <Loader2 className="animate-spin text-black" size={25} />
    </div>
  );
};

export default Loader;
