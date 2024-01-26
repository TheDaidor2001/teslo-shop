'use client'
import { useCartStore } from "@/store"
import { currencyFormat } from "@/utils"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"


export const OrderSumary = () => {

    const router = useRouter()
    const [loaded, setLoaded] = useState(false)
    const { itemsInCart, subTotal, tax, total } = useCartStore(state => state.getSumaryInformation())

    useEffect(() => {
        setLoaded(true)
    }, [])

    useEffect(() => {
        if (itemsInCart === 0 && loaded === true) {
            router.replace('/empty')
        }
    }, [itemsInCart, loaded, router])


    if (!loaded) return <p>Cargando...</p>

    return (
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
    )
}
