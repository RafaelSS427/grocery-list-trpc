import { router, procedure } from '../trpc'
import { z } from 'zod'

// get, post, put, delete
export const groceryRouter = router({
    getAll: procedure.query(({ ctx }) => {
        return ctx.prisma.groceryList.findMany({
            orderBy: {
                title: "asc"
            }
        })
    }),
    create: procedure.input((
        z.object({
            title: z.string()
        })
    )).mutation(({ ctx, input }) => {
        const { title } = input

        return ctx.prisma.groceryList.create({
            data: {
                title
            }
        })
    }),
    check: procedure.input((
        z.object({
            id: z.string(),
            checked: z.boolean()
        })
    )).mutation(({ ctx, input }) => {
        return ctx.prisma.groceryList.update({
            where: { id: input.id },
            data: {
                checked: input.checked
            }
        })

    }),
    delete: procedure.input((
        z.object({
            id: z.string()
        })
    )).mutation(({ ctx, input }) => {
        return ctx.prisma.groceryList.delete({
            where: { id: input.id }
        })
    })
})