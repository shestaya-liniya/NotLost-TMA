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

// --- Tanstack Router ---
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import TelegramProvider from "./lib/telegram/telegram-provider.tsx";

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const router = createRouter({ routeTree });

const root = ReactDOM.createRoot(document.getElementById("root")!);

try {
  init(retrieveLaunchParams().startParam === "debug" || import.meta.env.DEV);

  root.render(
    <StrictMode>
      <TelegramProvider>
        <RouterProvider router={router} />
      </TelegramProvider>
    </StrictMode>
  );
} catch (e) {
  root.render(<EnvUnsupported />);
}
