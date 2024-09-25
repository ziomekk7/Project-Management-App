export const routes = {
	home: () => '/',	
	projects: {
		create: () => '/project/create',
		details: (params: { projectId: string }) => `/projects/${params.projectId}/details`,
	},
}
