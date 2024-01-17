'use client'

import { titleFont } from "@/config/fonts"
import { useCartStore, useUiStore } from "@/store"
import Link from "next/link"
import { useEffect, useState } from "react"
import { IoCartOutline, IoSearchOutline } from "react-icons/io5"


export const TopMenu = () => {

    const showMenu = useUiStore(state => state.openSideMenu)
    const totalItemsInCart = useCartStore(state => state.getTotalItems())

    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    return (
        <nav className="flex px-5 justify-between items-center w-full">
            {/**Logo */}
            <div>
                <Link
                    href="/"
                >
                    <span className={`${titleFont.className} antialiased font-bold`}>Teslo</span>
                    <span> | Shop</span>
                </Link>
            </div>

            {/**Center Menu */}
            <div className="hidden sm:block">
                <Link
                    className="mr-2 p-2 rounded-md transition-all hover:bg-gray-100"
                    href="/gender/men"
                >Hombres</Link>
                <Link
                    className="mr-2 p-2 rounded-md transition-all hover:bg-gray-100"
                    href="/gender/women"
                >Mujeres</Link>
                <Link
                    className="mr-2 p-2 rounded-md transition-all hover:bg-gray-100"
                    href="/gender/kid"
                >Niños</Link>
            </div>

            {/**Search card menu */}
            <div className="flex items-center">
                <Link href="/search" className="mx-2">
                    <IoSearchOutline className="w-5 h-5" />
                </Link>
                <Link href={
                    (totalItemsInCart === 0 && isLoaded)
                        ? "/empty"
                        : "/cart"
                } className="mx-2">
                    <div className="relative">
                        {(isLoaded && totalItemsInCart > 0) && (
                            <span className="absolute fade-in text-xs rounded-full px-1 font-bold -top-2 -right-2 bg-blue-700 text-white">
                                {totalItemsInCart}
                            </span>
                        )}
                        <IoCartOutline className="w-5 h-5" />
                    </div>
                </Link>
                <button onClick={() => showMenu()} className="m-2 p-2 rounded-md transition-all hover:bg-gray-100">Menú</button>
            </div>
        </nav>
    )
}
