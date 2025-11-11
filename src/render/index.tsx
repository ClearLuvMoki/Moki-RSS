import "./i18n";
import "./index.css";
import App from "@/render/App";
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";
import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <HeroUIProvider className="w-full h-full">
    <App />
    <ToastProvider
      toastProps={{
        timeout: 2000,
      }}
    />
  </HeroUIProvider>,
);
