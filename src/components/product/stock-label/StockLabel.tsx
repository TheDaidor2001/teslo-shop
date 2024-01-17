'use client'

import { getStockBySlug } from '@/actions';
import { titleFont } from '@/config/fonts'
import { useEffect, useState } from 'react';

interface Props {
    slug: string;
}


export const StockLabel = ({ slug }: Props) => {


    const [inStock, setInStock] = useState<Number>(0)
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        getStock()
    }, [])


    const getStock = async () => {
        //llamar al server action
        const stock = await getStockBySlug(slug)
        setInStock(stock)

        setIsLoading(false)
    }


    return (

        <>

            {
                isLoading
                    ? (
                        <h1 className={`${titleFont.className} antialiased font-bold text-lg bg-gray-200 animate-pulse rounded-md`}>&nbsp;</h1>
                    )
                    : (
                        <h1 className={`${titleFont.className} antialiased font-bold text-lg`}>Stock: {inStock.toString()}</h1>
                    )
            }
        </>
    )
}
