import { z } from 'zod'
import { router } from '@/server/trpc'
import { groceryRouter } from './grocery'

export const appRouter = router({
    grocery: groceryRouter
})

// hello: procedure.input((
//     z.object({
//         text: z.string()
//     })
// )).query((opts) => {
//     return {
//         greeting: `hello ${ opts.input.text }`
//     }
// })

export type AppRouter = typeof appRouter