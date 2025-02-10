import { getSingleUserAPI } from "@/APIs/authAPIs";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { SocketProvider } from "@/contexts/SocketContext";
import { VideoChatProvider } from "@/contexts/VideoChatContext";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router";
import Header from "../common/Header";
import Sidebar from "../common/Sidebar";
import RecommendationCard from "../specific/RecommendationCard";
import ChatDrawer from "../specific/chat/ChatDrawer";

const AppLayout = ({
  component,
}: Readonly<{
  component: React.ReactNode;
}>) => {
  const location = useLocation();
  const isProfilePage = location.pathname.startsWith("/profile");

  const { data: userData, isLoading } = useQuery({
    queryKey: ["user-data"],
    queryFn: () => getSingleUserAPI(),
  });

  return (
    <div className="w-full h-dvh md:h-screen flex flex-col bg-bgGray overflow-hidden">
      <NotificationProvider>
        <Header userData={userData} />
      </NotificationProvider>
      <>
        {" "}
        <SocketProvider>
          <VideoChatProvider>
            <div className="w-full flex-1 grid grid-cols-12">
              {!isProfilePage && (
                <aside className="hidden lg:block lg:col-span-2 h-full">
                  <Sidebar userData={userData} isLoading={isLoading} />
                </aside>
              )}

              <main
                className={`col-span-12 p-2 ${
                  !isProfilePage ? "lg:col-span-7" : "lg:col-span-9"
                }`}
              >
                {component}
              </main>

              {/* Right Aside (always visible on lg) */}
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
