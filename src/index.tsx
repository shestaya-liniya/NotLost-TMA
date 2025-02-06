import ReactDOM from "react-dom/client";
import { StrictMode } from "react";

import "./index.css";

// --- Telegram env ---
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { EnvUnsupported } from "@/lib/telegram/env/env-unsupported.tsx";
import { init } from "@/lib/telegram/env/init.ts";
import "@telegram-apps/telegram-ui/dist/styles.css";
import "./lib/telegram/env/mock-env.ts";
// ------

import TelegramProvider from "./lib/telegram/telegram-provider.tsx";
import App from "./components/App.tsx";

const root = ReactDOM.createRoot(document.getElementById("root")!);

try {
  init(retrieveLaunchParams().startParam === "debug" || import.meta.env.DEV);

  root.render(
    <StrictMode>
      <TelegramProvider>
        <App />
      </TelegramProvider>
    </StrictMode>
  );
} catch (e) {
  root.render(<EnvUnsupported />);
}
