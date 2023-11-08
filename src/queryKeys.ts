export const queryKeys = {
	projects: {
		all: () => ['projects'] as const,
		details: (params: { projectId: string }) => ['projects', params.projectId] as const,
	},
}
