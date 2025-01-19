import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import NotificationPopup from "./NotificationPopup";
import SearchBox from "./SearchBox";
import UserProfilePopup from "./UserProfilePopup";

const Header = () => {
  return (
    <div className="h-14 flex items-center justify-between px-4 py-2">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-white">App Logo</h1>
      </div>

      <div className="ml-auto flex items-center gap-5">
        <SearchBox />
        <NotificationPopup />
        <Popover>
          <PopoverTrigger>
            {" "}
            <Avatar className="w-10 h-10">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="User Avatar"
              />
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] flex flex-col p-2">
            <UserProfilePopup />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Header;
