import compression from '@polka/compression'
import polka from 'polka'

import { handler } from '../build/handler.js'

const compress = compression({ threshold: 1024 })

polka()
	.use((req, res, next) => {
		// remult's SSE endpoint: buffering it would freeze every liveQuery.
		if (req.url.startsWith('/api/stream')) return next()
		compress(req, res, next)
	})
	.use(handler)
	.listen(Number(process.env.PORT ?? 3000), () => {
		console.info(`listening on ${process.env.PORT ?? 3000}`)
	})
