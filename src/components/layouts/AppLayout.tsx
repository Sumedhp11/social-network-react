import { NotificationProvider } from "@/contexts/NotificationContext";
import { SocketProvider } from "@/contexts/SocketContext";
import Header from "../common/Header";
import Sidebar from "../common/Sidebar";
import ChatDrawer from "../specific/chat/ChatDrawer";
import VideoChatProvider from "@/contexts/VideoChatContext";

const AppLayout = ({
  component,
}: Readonly<{
  component: React.ReactNode;
}>) => {
  return (
    <div className="w-full h-dvh md:h-screen flex flex-col bg-bgGray overflow-hidden">
      <NotificationProvider>
        <Header />
      </NotificationProvider>

      <div className="w-full flex-1 grid grid-cols-12">
        <aside className="hidden lg:block lg:col-span-2 h-full">
          <Sidebar />
        </aside>
        <main className="col-span-12 lg:col-span-8 h-full p-4 overflow-y-hidden">
          {component}
        </main>

        <aside className="hidden lg:block lg:col-span-2 h-full border-l"></aside>
      </div>

      <div className="z-50 rounded-sm w-[30%] md:w-[18%] fixed bottom-1 right-4 flex justify-center items-center">
        <SocketProvider>
          <VideoChatProvider>
            <ChatDrawer />
          </VideoChatProvider>
        </SocketProvider>
      </div>
    </div>
  );
};

export default AppLayout;
