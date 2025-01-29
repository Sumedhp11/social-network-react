
const NoDataFound = ({ text }: { text: string }) => {
  return (
    <div className="w-full flex items-center justify-center my-3">
      <p className="font-normal text-lg text-white">{text}</p>
    </div>
  );
};

export default NoDataFound;
