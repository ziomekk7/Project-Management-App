import { Routes, Route, Navigate } from 'react-router-dom'
import AddProject from './components/Pages/CreatingProject/CreatingProject'
import RootLayout from './components/Roots/RootLayout'
import ProjectDetails from './components/Pages/ProjectDetails/ProjectDetails'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { routes } from './routes'

function App() {
	const queryClient = new QueryClient()
	return (
		<QueryClientProvider client={queryClient}>
			<RootLayout />
			<Routes>
				<Route path={routes.home()} element={<div>Home</div>} />
				<Route path={routes.projects.create()} element={<AddProject />} />
				// @TODO use :projectId instead of :id
				<Route path={routes.projects.details({ projectId: ':projectId' })} element={<ProjectDetails />} />
				<Route path="*" element={<Navigate to={routes.home()} />} />
			</Routes>
		</QueryClientProvider>
	)
}

export default App
