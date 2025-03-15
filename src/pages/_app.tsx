import "@/styles/globals.css";
import { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster  position="bottom-right"/>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
};

export default MyApp;
