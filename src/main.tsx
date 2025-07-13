import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

import * as TanStackQueryProvider from "./integrations/tanstack-query/root-provider.tsx";
import { routeTree } from "./routeTree.gen";
import reportWebVitals from "./reportWebVitals.ts";
import "./styles.css";

const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProvider.getContext(),
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

async function bootstrap() {
  try {
    const { default: startServer } = await import("./mock");
    await startServer();
    console.log("✅ Mock server started");
  } catch (error) {
    console.error("❌ Failed to start mock server:", error);
  }

  const rootElement = document.getElementById("app");
  if (rootElement && !rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <StrictMode>
        <TanStackQueryProvider.Provider>
          <RouterProvider router={router} />
        </TanStackQueryProvider.Provider>
      </StrictMode>
    );
  }

  reportWebVitals();
}

bootstrap();
