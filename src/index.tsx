import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import "./index.css";

// --- Telegram env ---
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { EnvUnsupported } from "@/lib/telegram/env/env-unsupported.tsx";
import { init } from "@/lib/telegram/env/init.ts";
import "./lib/telegram/env/mock-env.ts";
// ------

import TelegramProvider from "./lib/telegram/telegram-provider.tsx";
import App from "./App.tsx";
import { JazzAndAuth } from "./lib/jazz/jazzProvider.tsx";

const root = ReactDOM.createRoot(document.getElementById("root")!);

try {
  init(retrieveLaunchParams().startParam === "debug" || import.meta.env.DEV);
  import("eruda").then((lib) => lib.default.init()).catch(console.error);

  root.render(
    <StrictMode>
      <TelegramProvider>
        <Router>
          <JazzAndAuth>
            <App />
          </JazzAndAuth>
        </Router>
      </TelegramProvider>
    </StrictMode>
  );
} catch (e) {
  console.log(e);

  root.render(<EnvUnsupported />);
}
