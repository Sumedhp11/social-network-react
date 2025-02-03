import { NotificationProvider } from "@/contexts/NotificationContext";
import { SocketProvider } from "@/contexts/SocketContext";
import { VideoChatProvider } from "@/contexts/VideoChatContext";
import { useLocation, useParams } from "react-router";
import Header from "../common/Header";
import Sidebar from "../common/Sidebar";
import ChatDrawer from "../specific/chat/ChatDrawer";
import RecommendationCard from "../specific/RecommendationCard";
import FriendList from "../common/FriendList";

const AppLayout = ({
  component,
}: Readonly<{
  component: React.ReactNode;
}>) => {
  const location = useLocation();
  const isProfilePage = location.pathname.startsWith("/profile");

  const { userId } = useParams<{ userId: string }>();

  return (
    <div className="w-full h-dvh md:h-screen flex flex-col bg-bgGray overflow-hidden">
      <NotificationProvider>
        <Header />
      </NotificationProvider>
      <>
        {" "}
        <SocketProvider>
          <VideoChatProvider>
            <div className="w-full flex-1 grid grid-cols-12">
              <aside className="hidden lg:block lg:col-span-2 h-full">
                {!isProfilePage ? (
                  <Sidebar />
                ) : (
                  <FriendList userId={parseInt(userId!)} />
                )}
              </aside>
              <main className="col-span-12 lg:col-span-7">{component}</main>

              <aside className="hidden lg:block lg:col-span-3 h-full">
                <RecommendationCard />
              </aside>
            </div>

            <div className="z-50 rounded-sm w-[30%] md:w-[18%] fixed bottom-1 right-4 flex justify-center items-center">
              <ChatDrawer />
            </div>
          </VideoChatProvider>{" "}
        </SocketProvider>
      </>
    </div>
  );
};

export default AppLayout;
