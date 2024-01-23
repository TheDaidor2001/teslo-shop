'use server'

import { middleware } from "@/auth.config"
import prisma from "@/lib/prisma"


export const getOrdersBySessionUser = async () => {

    const session = await middleware()

    if(!session?.user) {
        return {
            ok: false,
            message: 'Debe de estar auntenticado'
        }
    }

    const orders = await prisma.order.findMany({
        where: {
            userId: session.user.id
        },
        include: {
            OrderAddress: {
                select: {
                    firstName: true,
                    lastName: true
                }
            }
        }
    })


    return {
        ok: true,
        orders: orders
    }

}