'use server'

import prisma from "@/lib/prisma";

export const getStockBySlug = async (slug: string):Promise<Number> => {

    try {

        const stock = await prisma.product.findUnique({
            where: {
                slug: slug
            },
            select: {
                inStock: true
            }
        })

        return stock?.inStock ?? 0
        
    } catch (error) {
        console.log(error);
        throw new Error('Error al obtener el stock');
        
    }

}