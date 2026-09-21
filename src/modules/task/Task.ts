import { Roles } from '#lib/roles.ts'

import { Allow, Fields, remult, Validators } from 'remult'
import { FF_Entity } from 'firstly'

export const PRIORITIES = ['low', 'normal', 'high'] as const
export type Priority = (typeof PRIORITIES)[number]

// FF_Entity = @Entity + changeLog wiring (see /internal/changes).
@FF_Entity<Task>('tasks', {
	allowApiRead: true,
	allowApiInsert: Allow.authenticated,
	allowApiUpdate: Allow.authenticated,
	allowApiDelete: Roles.admin,
	defaultOrderBy: { completed: 'asc', createdAt: 'desc' },
})
export class Task {
	@Fields.id()
	id!: string

	@Fields.string<Task>({
		validate: [Validators.required, (t) => t.title.length > 2 || 'Too short (3 chars min)'],
	})
	title = ''

	@Fields.boolean()
	completed = false

	@Fields.literal(() => PRIORITIES)
	priority: Priority = 'normal'

	@Fields.string({ allowApiUpdate: false, defaultValue: () => remultUserId() })
	ownerId = ''

	@Fields.createdAt()
	createdAt?: Date
}

function remultUserId() {
	return remult.user?.id ?? ''
}
