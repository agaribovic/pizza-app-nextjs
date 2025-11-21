import "../styles/globals.css";
import { ReactNode, FC } from "react";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ReduxProvider from "@/redux/ReduxProvider";

export const metadata = {
  title: "Pizza Order App",
  description: "Full stack web app",
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
};

export default RootLayout;
