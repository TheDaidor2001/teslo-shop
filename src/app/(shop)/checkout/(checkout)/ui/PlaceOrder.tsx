/* eslint-disable react/no-unescaped-entities */
'use client'

import { placeOrder } from "@/actions"
import { useAddressStore, useCartStore } from "@/store"
import { currencyFormat } from "@/utils"
import clsx from "clsx"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export const PlaceOrder = () => {

    const router = useRouter()

    const [loaded, setlLoaded] = useState(false)
    const [isPlacingOrder, setIsPlacingOrder] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')


    const address = useAddressStore(state => state.address)
    const { itemsInCart, subTotal, tax, total } = useCartStore(state => state.getSumaryInformation())

    const cart = useCartStore(state => state.cart)
    const clearCart = useCartStore(state => state.clearCart)




    useEffect(() => {
        setlLoaded(true)
    }, [])


    const onPlaceOrder = async () => {

        setIsPlacingOrder(true)

        const productsToOrder = cart.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            size: item.size
        }))


        //server action
        const res = await placeOrder(productsToOrder, address)

        if (!res.ok) {
            setIsPlacingOrder(false)
            setErrorMessage(res.message)

            return
        }

        //* TODO salio bien
        clearCart();
        router.replace('/orders/' + res.order);
    }


    if (!loaded) {
        return (
            <p>Cargando...</p>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-xl p-7">

            <h2 className="text-2xl mb-2 ">Dirección de entrega</h2>
            <div className="mb-10">
                <p className="text-xl">{address.firstName} - {address.lastName}</p>
                <p>{address.address}</p>
                <p>{address.addressTwo}</p>
                <p>{address.postalCode}</p>
                <p>{address.phone}</p>
            </div>

            {/**divider */}
            <div className="w-full h-0.5 bg-gray-200 mb-10" />

            <h2 className="text-2xl mb-2 ">Resumen del pedido</h2>

            <div className="grid grid-cols-2">
                <span>No. Productos</span>
                <span className="text-right">{itemsInCart === 1 ? '1 Artículo' : `${itemsInCart} Artículos`}</span>

                <span>Subtotal</span>
                <span className="text-right">{currencyFormat(subTotal)}</span>

                <span className="text-sm">Impuestos (15%)</span>
                <span className="text-right text-sm">{currencyFormat(tax)}</span>

                <span className="text-2xl mt-5">Total: </span>
                <span className="text-right mt-5 text-2xl">{currencyFormat(total)}</span>
            </div>

            <div className="mt-5 mb-2 w-full">
                <p className="mb-5">
                    <span className="text-xs">
                        Al hacer click en "Aceptar orden", acepta nuestros <a href="#" className="underline">términos y condiciones</a> y <a href="#" className="underline">política de privacidad</a>
                    </span>
                </p>

                <p className="text-red-500">{errorMessage}</p>
                <button
                    // href={'/orders/123'}
                    onClick={onPlaceOrder}
                    className={clsx({
                        'btn-primary': !isPlacingOrder,
                        'btn-disabled': isPlacingOrder,
                    })}
                >
                    Colocar Orden
                </button>
            </div>

        </div>
    )
}
