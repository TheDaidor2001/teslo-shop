'use server'

import { middleware } from "@/auth.config"
import prisma from "@/lib/prisma"
import { Gender } from "@prisma/client";

interface PaginationOptions {
    page?: number;
    take?: number;
    gender?: Gender
}

export const getPaginatedOrders = async (
    {
        page = 1,
        take = 12,
        gender,
       }:PaginationOptions
) => {

    const session = await middleware()

    if(session?.user.role !== 'admin') {
        return {
            ok: false,
            message: 'Debe de estar auntenticado'
        }
    }

    const orders = await prisma.order.findMany({
        orderBy: {
            createdAt: 'desc'
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