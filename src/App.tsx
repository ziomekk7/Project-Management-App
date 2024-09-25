import { Routes, Route, Navigate } from "react-router-dom";
import CreatingProject from "./components/Pages/CreatingProject/CreatingProject";
import RootLayout from "./components/Roots/RootLayout";
import ProjectDetails from "./components/Pages/ProjectDetails/ProjectDetailViews/ProjectDetails";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routes } from "./routes";
import { AboutApp } from "./components/Pages/AboutApp/AboutApp";
import { MainPage } from "./components/Pages/MainPage/MainPage";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <RootLayout>
        <Routes>
          <Route path={routes.home()} element={<MainPage />} />
          <Route path={routes.aboutApp()} element={<AboutApp />} />
          <Route
            path={routes.projects.create()}
            element={<CreatingProject />}
          />
          <Route
            path={routes.projects.details({ projectId: ":projectId" })}
            element={<ProjectDetails />}
          />
          <Route path="*" element={<Navigate to={routes.home()} />} />
        </Routes>
      </RootLayout>
    </QueryClientProvider>
  );
}

export default App;
