import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router";

import "./index.css";

// --- Telegram env ---
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { EnvUnsupported } from "@/lib/telegram/env/envUnsupported.tsx";
import { init } from "@/lib/telegram/env/init.ts";
import "./lib/telegram/env/mockEnv.ts";
import { JazzAndAuth } from "@/lib/jazz/jazzProvider.tsx";
import TelegramProvider from "@/lib/telegram/telegramProvider.tsx";
import App from "@/App.tsx";
// ------

import { AliveScope } from "react-activation";
import { ErrorBoundary } from "./ErrorBoundary.tsx";

const root = ReactDOM.createRoot(document.getElementById("root")!);

function ErrorBoundaryError({ error }: { error: unknown }) {
  return (
    <div>
      <p>An unhandled error occurred:</p>
      <blockquote>
        <code>
          {error instanceof Error
            ? error.message
            : typeof error === "string"
              ? error
              : JSON.stringify(error)}
        </code>
      </blockquote>
    </div>
  );
}

try {
  init(retrieveLaunchParams().startParam === "debug");
  //import("eruda").then((lib) => lib.default.init()).catch(console.error);

  root.render(
    <ErrorBoundary fallback={ErrorBoundaryError}>
      <TelegramProvider>
        <Router>
          <JazzAndAuth>
            <AliveScope>
              <App />
            </AliveScope>
          </JazzAndAuth>
        </Router>
      </TelegramProvider>
    </ErrorBoundary>
  );
} catch (e) {
  console.log(e);

  root.render(<EnvUnsupported />);
}
