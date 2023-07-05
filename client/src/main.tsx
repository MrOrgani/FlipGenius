import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App.tsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "./pages/ErrorPage.tsx";
import { action as collectionAction } from "./components/NewCollectionCardButton.tsx";
import { loader as collectionLoader } from "./pages/CollectionsPage.tsx";
import CollectionsPage from "./pages/CollectionsPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import CollectionDashboardPage, {
  loader as collectionDashboardLoader,
  multipleAction as multipleActionCollectionDashboard,
} from "./pages/CollectionDashboardPage.tsx";

import store from "./store/store.ts";
import { Provider, useSelector } from "react-redux";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import LearnPage from "./pages/LearnPage.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
    },
  },
});

const CustomRouterProvider = () => {
  const globalState = useSelector((state) => state); // or get it from context/custom hook

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path={"/"} element={<App />} errorElement={<ErrorPage />}>
        <Route path={"home"} element={<HomePage />} />

        <Route
          path={"/collections/:userId"}
          loader={collectionLoader({ queryClient, globalState })}
          action={collectionAction({ queryClient, globalState })}
          element={<CollectionsPage />}
        />
        <Route
          path={"/collection/:collectionId"}
          loader={collectionDashboardLoader({ queryClient, globalState })}
          action={multipleActionCollectionDashboard({
            queryClient,
            globalState,
          })}
          element={<CollectionDashboardPage />}
        />
        <Route
          path={"/collection/:collectionId/learn"}
          loader={collectionDashboardLoader({ queryClient, globalState })}
          action={multipleActionCollectionDashboard({
            queryClient,
            globalState,
          })}
          element={<LearnPage />}
        />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <React.StrictMode>
      <ChakraProvider>
        <QueryClientProvider client={queryClient}>
          <CustomRouterProvider />
          <ReactQueryDevtools position="bottom-right" />
        </QueryClientProvider>
      </ChakraProvider>
    </React.StrictMode>
  </Provider>
);
