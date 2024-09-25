export const routes = {
	home: () => '/',	
	aboutApp: () => '/aboutApp',	
	projects: {
		create: () => '/project/create',
		details: (params: { projectId: string }) => `/projects/${params.projectId}/details`,
	},
}
