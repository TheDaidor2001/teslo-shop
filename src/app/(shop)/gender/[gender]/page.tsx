export const revalidate = 60

import { getPaginatedProductsWhitImages } from "@/actions"
import { Pagination, ProductGrid, Title } from "@/components"

import { initialData } from "@/seed/seed"
import { Gender } from "@prisma/client"
import { redirect } from "next/navigation"

const seedProducts = initialData.products


interface Props {
    params: {
        gender: string
    },
    searchParams: {
        page?: string
    }

}

export default async function Category({ params, searchParams }: Props) {
    const { gender } = params

    const page = searchParams.page ? parseInt(searchParams.page) : 1

    const { products, currentPage, totalPages } = await getPaginatedProductsWhitImages({ page, gender: gender as Gender })



    if (products.length === 0) {
        redirect(`/gender/${gender}`)
    }



    const labels: Record<string, string> = {
        'men': 'para Hombres',
        'women': 'para Mujeres',
        'kid': 'para Niños',
        'unisex': 'para todos'
    }

    // if (id === 'kids') {
    //     notFound()
    // }




    return (
        <>
            <Title title={`Articulos ${labels[gender]}`} subtitle={`Ropa para ${labels[gender]}`} className='mb-2' />
            <ProductGrid products={products} />

            <Pagination totalPages={totalPages} />
        </>
    )
}
