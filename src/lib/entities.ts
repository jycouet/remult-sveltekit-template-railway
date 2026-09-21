import { User } from '#modules/auth/User.ts'
import { Task } from '#modules/task/Task.ts'

import type { ClassType } from 'remult'

/** Single source of truth: the API, the Admin UI and the seed all read this. */
export const entities: ClassType<unknown>[] = [Task, User]
