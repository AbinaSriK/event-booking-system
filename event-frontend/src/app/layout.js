import { Outfit } from "next/font/google";
import "./globals.css";
import QueryProvider from "../providers/QueryProvider";
import Navbar from "../components/Navbar";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata = {
  title: "Evently",
  description: "Event Booking System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={outfit.variable}>
        <QueryProvider>
          <Navbar />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}