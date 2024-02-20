import "@/styles/globals.css";
import { Inter } from "next/font/google";
import type { AppProps } from "next/app";
import { GoogleOAuthProvider } from "@react-oauth/google";
import toast, { Toaster } from "react-hot-toast";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.className}>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId="1051486961483-qq4a8o65d4juq1gdbbqnuu7tolpv1v4t.apps.googleusercontent.com">
          <Component {...pageProps} />;
          <Toaster />
          <ReactQueryDevtools/>
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </div>
  );
}
