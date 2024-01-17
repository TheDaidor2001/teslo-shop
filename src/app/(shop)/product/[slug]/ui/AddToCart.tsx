'use client'

import { CuantitySelector, SizeSelector } from "@/components"
import { CartProduct, Product, Size } from "@/interfaces"
import { useCartStore } from "@/store"
import { useState } from "react"


interface Props {
    product: Product
}


export const AddToCart = ({ product }: Props) => {

    const addProductToCart = useCartStore(state => state.addProduct)

    const [size, setSize] = useState<Size | undefined>()
    const [quantity, setQuantity] = useState<number>(1)
    const [posted, setPosted] = useState(false)

    const addToCart = () => {

        setPosted(true)

        if (!size) return

        const cartProduct: CartProduct = {
            id: product.id,
            slug: product.slug,
            title: product.title,
            price: product.price,
            quantity: quantity,
            size: size,
            image: product.images[0]
        }

        addProductToCart(cartProduct)
        setPosted(false)
        setQuantity(1)
        setSize(undefined)
    }


    return (
        <>

            {
                posted && !size && (
                    <p className="mt-3 text-red-500 fade-in">Debe seleccionar una talla</p>
                )
            }
            {/**selector de tallas */}
            <SizeSelector availableSizes={product.sizes} selectedSize={size} onSelectedSize={setSize} />

            {/**selector de cantidad */}
            <CuantitySelector quantity={quantity} onQuantityChange={setQuantity} />

            {/**boton*/}
            <button className="btn-primary my-5" onClick={addToCart}>
                Agregar al carrito
            </button>
        </>
    )
}
