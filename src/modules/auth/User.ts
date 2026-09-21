import { Roles } from '#lib/roles.ts'

import { Allow, Fields, Validators } from 'remult'
import { FF_Entity } from 'firstly'

@FF_Entity<User>('users', {
	allowApiRead: Allow.authenticated,
	allowApiCrud: Roles.admin,
	defaultOrderBy: { name: 'asc' },
})
export class User {
	@Fields.id()
	id!: string

	@Fields.string<User>({ validate: [Validators.required, Validators.unique] })
	email = ''

	@Fields.string<User>({ validate: Validators.required })
	name = ''

	@Fields.json<User, string[]>({ allowApiUpdate: Roles.admin })
	roles: string[] = []

	/** Set when the email was proven. Only enforced if REQUIRE_EMAIL_VERIFICATION is on. */
	@Fields.date({ allowNull: true, allowApiUpdate: false })
	verifiedAt: Date | null = null

	@Fields.createdAt()
	createdAt?: Date
}
