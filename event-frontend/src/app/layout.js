import "./globals.css";
import QueryProvider from "../providers/QueryProvider";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Evently",
  description: "Event Booking System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <Navbar />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
