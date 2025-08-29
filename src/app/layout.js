import Navbar from "@/components/Navbar";
import { Provider } from "./provider";
import {Onest, Poppins, Lexend} from "next/font/google"


const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
})


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${onest.variable} ${poppins.variable} ${lexend.variable}`}>
        <Provider>
          {/* <Navbar /> */}
          {children}
        </Provider>
      </body>
    </html>
  );
}
