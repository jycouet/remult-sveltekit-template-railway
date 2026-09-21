import { FF_Role } from 'firstly'
import { Roles_ChangeLog } from 'firstly/changeLog'
import { Roles_Cron } from 'firstly/cron'
import { Roles_Mail } from 'firstly/mail'
import { Roles_SqlAdmin } from 'firstly/sqlAdmin'

/** Every role of the app, in one place. Modules bring their own. */
export const Roles = {
	admin: 'admin',
	...FF_Role,
	...Roles_ChangeLog,
	...Roles_Cron,
	...Roles_Mail,
	...Roles_SqlAdmin,
} as const

/** An app admin holds every role, module roles included. */
export const ADMIN_ROLES = Object.values(Roles)
