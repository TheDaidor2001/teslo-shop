'use server'

import prisma from "@/lib/prisma";

export const getProductBySlug = async (slug: string) => {

    try {
        
        const product = await prisma.product.findUnique({
            include: {
                ProductImages: {
                    select: {
                        url: true
                    }
                }
            },
            where: {
                slug: slug
            }
        })

        if(!product) return null

        const {ProductImages, ...rest} = product


        return {
            ...rest,
            images: product.ProductImages.map(img => img.url)
        }

    } catch (error) {
        console.log(error);
        throw new Error('Error getting product by slug')
        
    }

}