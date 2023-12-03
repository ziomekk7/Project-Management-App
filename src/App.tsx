import { Routes, Route, Navigate } from "react-router-dom";
import AddProject from "./components/Pages/CreatingProject/CreatingProject";
import RootLayout from "./components/Roots/RootLayout";
import ProjectDetails from "./components/Pages/ProjectDetails/ProjectDetails";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routes } from "./routes";
import { Grid, GridItem } from "@chakra-ui/react";
// @TODO change chceckbox duplicate arr to obj arr

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Grid templateColumns="1fr 4fr ">
        <GridItem>
          <RootLayout />
        </GridItem>
        <GridItem>
          <Routes>
            <Route path={routes.home()} element={<div>Home</div>} />
            <Route path={routes.projects.create()} element={<AddProject />} />
            <Route
              path={routes.projects.details({ projectId: ":projectId" })}
              element={<ProjectDetails />}
            />
            <Route path="*" element={<Navigate to={routes.home()} />} />
          </Routes>
        </GridItem>
      </Grid>
    </QueryClientProvider>
  );
}

export default App;
