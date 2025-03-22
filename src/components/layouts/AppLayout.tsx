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
  const isLiveStreamPage =
    location.pathname.startsWith("/live-stream") ||
    location.pathname.startsWith("/start-stream");


  const { data: userData, isLoading } = useQuery({
    queryKey: ["user-data"],
    queryFn: () => getSingleUserAPI(),
  });

  return (
    <div className="w-full h-dvh md:h-screen flex flex-col bg-bgGray overflow-hidden">
      <NotificationProvider>
        <Header userData={userData} />

        <>
          {" "}
          <SocketProvider>
            <VideoChatProvider>
              <div className="w-full flex-1 grid grid-cols-12">
                {!isProfilePage && !isLiveStreamPage && (
                  <aside className="hidden lg:block lg:col-span-2 h-full">
                    <Sidebar userData={userData} isLoading={isLoading} />
                  </aside>
                )}

                <main
                  className={`col-span-12 p-2 ${
                    isProfilePage
                      ? "lg:col-span-9"
                      : isLiveStreamPage
                      ? "lg:col-span-12"
                      : "lg:col-span-7"
                  }`}
                >
                  {component}
                </main>

                {/* Right Aside (always visible on lg) */}
                {!isLiveStreamPage ? (
                  <aside className="hidden lg:block lg:col-span-3 h-full">
                    <RecommendationCard />
                  </aside>
                ) : null}
              </div>

              <div className="z-50 rounded-sm w-[50%] md:w-[40%] lg:w-[20%] fixed bottom-1 right-4 flex justify-center items-center">
                <ChatDrawer />
              </div>
            </VideoChatProvider>{" "}
          </SocketProvider>
        </>
      </NotificationProvider>
    </div>
  );
};

export default AppLayout;
