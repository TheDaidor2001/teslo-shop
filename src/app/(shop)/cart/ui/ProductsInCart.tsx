'use client'

import { useEffect, useState } from "react"
import { CuantitySelector } from "@/components"
import Image from "next/image"
import { useCartStore } from "@/store"
import Link from "next/link"




export const ProductsInCart = () => {

    const [loaded, setLoaded] = useState(false)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const productsInCart = useCartStore(state => state.cart)
    const updateProductQuantity = useCartStore(state => state.updateProduct)
    const removeProduct = useCartStore(state => state.removeProduct)


    useEffect(() => {
        setLoaded(true)
    }, [])

    if (!loaded) {
        return <p>Cargando...</p>
    }

    return (
        <>
            {
                productsInCart.map(product => (
                    <div key={`${product.slug} - ${product.size}`} className="flex mb-5">
                        <Image
                            src={`/products/${product.image}`}
                            alt={product.title}
                            width={100}
                            height={100}
                            style={{
                                width: '100px',
                                height: '100px',
                            }}
                            className="mr-5 rounded"
                        />

                        <div>
                            <Link
                                href={`/product/${product.slug}`}
                                className="hover:underline cursor-pointer"
                            >
                                {product.size} - {product.title}
                            </Link>
                            <p>{product.price}€</p>
                            <CuantitySelector quantity={product.quantity} onQuantityChange={quantity => updateProductQuantity(product, quantity)
                            } />
                            <button onClick={() => removeProduct(product)} className="underline mt-3">Remover</button>
                        </div>
                    </div>
                ))
            }
        </>
    )
}
