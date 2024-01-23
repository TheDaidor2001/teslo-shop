'use server'

import { middleware } from "@/auth.config"
import prisma from "@/lib/prisma"


export const getOrderById = async (id: string) => {
    const session = await middleware()

    if(!session) {
        return {
            ok: false,
            message: 'Debe de estar autenticado'
        }
    }

    try {

        const order = await prisma.order.findUnique({
            where: {id},
            include: {
                OrderAddress: true,
                OrderItem: {
                    select: {
                        price: true,
                        quantity: true,
                        size: true,

                        product: {
                            select: {
                                title: true,
                                slug: true,

                                ProductImages: {
                                    select: {
                                        url: true
                                    },
                                    take: 1,
                                }
                            }
                        }
                    }
                }
            }
        });

        if(!order) throw `${id} no existe`

        if(session.user.role === 'user') {
            if(session.user.id !== order.userId) throw `${id} No tienes permisos`
        }



        return {
            ok:true,
            order: order
        }
        
    } catch (error) {
        console.log(error);
        

        return {
            ok: false,
            message: `Orden no existe`
        }
        
    }
}