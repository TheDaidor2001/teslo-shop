'use server'

import { middleware } from "@/auth.config";
import type { Address, Size } from "@/interfaces";
import prisma from "@/lib/prisma";
import { off } from "process";

interface ProductToOrder {
    productId: string;
    quantity: number;
    size: Size
}


export const placeOrder = async (productIds: ProductToOrder[], address: Address) => {

    const session = await middleware()
    const userId = session?.user.id;
    
    //Verificar usuario
    if(!userId) {
        return {
            ok:false,
            message: 'No hay sesion de usuario',
        }
    }

    //Obtener la info de productos
    const products = await prisma.product.findMany({
        where: {id: {
            in: productIds.map(p => p.productId)
        }}
    })

    //calcular el precio 
    const itemsInOrder = productIds.reduce((acc, product) => acc + product.quantity,0)

    //totales de tax, subtotal, y total
    const {subtotal, tax, total} = productIds.reduce((totals, item) => {
       const productQuantity = item.quantity
       const product = products.find(p => p.id === item.productId)

        if(!product) {
            throw new Error('Producto no encontrado - Error 500')
        }

        const subtotal = product.price * productQuantity
        totals.subtotal += subtotal
        totals.tax += subtotal * 0.15
        totals.total += subtotal * 1.15

        return totals

    }, {subtotal:0, tax:0, total: 0})


    //TODO Crear la transacción

    try {
        const prismaTsx = await prisma.$transaction(async(tx) => {

            //1. Actualizar el stock de los productos
            const updatedProductsPromises = products.map( (product) => {
    
                //Acumular los valores
                const productQuantity = productIds.filter(
                    p => p.productId === product.id
                ).reduce((acc, item) => acc + item.quantity, 0)
    
                if (productQuantity === 0) {
                    throw new Error(`${product.id} no tiene cantidad definida`)
                }
    
                return tx.product.update({
                    where: {id: product.id},
                    data: {
                        // inStock: product.inStock - productQuantity, -> no hacer
                        inStock: {
                            decrement: productQuantity,
                        }
                    }
                })
            })
    
            const updatedProducts = await Promise.all(updatedProductsPromises)
    
            //verificar valores negativos 
            updatedProducts.forEach(product => {
                if(product.inStock < 0) {
                    throw new Error(`${product.title} no tiene inventario suficiente`)
                }
            })
            
    
            //2. crear la order - Encabezado - Detalle
            const order = await tx.order.create({
                data: {
                    userId: userId,
                    itemsInOrder: itemsInOrder,
                    subTotal: subtotal,
                    tax: tax,
                    total: total,
    
    
                    OrderItem: {
                        createMany: {
                            data: productIds.map(product => ({
                                productId: product.productId,
                                quantity: product.quantity,
                                size: product.size,
                                price: products.find(p => p.id === product.productId)?.price ?? 0
                            }))
                        }
                    }
                }
            })
    
            //Validar si el price es 0 lanzar error
    
            //3. Crear la direccion de la orden
            const {country, ...restAddress} = address
            const orderAddress = await tx.orderAddress.create({
                data: {
                    ...restAddress,
                    countryId: country,
                    orderId: order.id,
                }
            })
    
    
            return {
                order: order,
                orderAddres: orderAddress,
            }
        })


        return {
            ok: true,
            order: prismaTsx.order.id,
            prismaTsx: prismaTsx
        }

    } catch (error: any) {
        return {
            ok: false,
            message: error?.message,
        }
    }


}



