import  prisma  from "../lib/prisma"
import { initialData } from "./seed";
import { countries } from "./seedCountries";



async function main() {

    //Borrar registros previos
    await Promise.all([
        await prisma.userAddress.delete(),
        await prisma.user.deleteMany(),
        await prisma.country.deleteMany(),
        await prisma.productImage.deleteMany(),
        await prisma.product.deleteMany(),
        await prisma.category.deleteMany()
    ])

    const {categories, products, users} = initialData;



    await prisma.user.createMany({
        data: users
    })

    await prisma.country.createMany({
        data: countries
    })


    //Categorias
    const categoriesData = categories.map((category) => ({
        name: category,
    }))

    await prisma.category.createMany({
        data: categoriesData,
    })


    const categoriesDb = await prisma.category.findMany()
    
    const categoriesMap = categoriesDb.reduce((map, category) => {
        map[category.name.toLowerCase()] = category.id;
        return map
    }, {} as Record<string, string>)

    

    //Productos
    products.forEach(async (product) => {
        const {type, images, ...rest} = product

        const dbProduct = await prisma.product.create({
            data: {
                ...rest,
                categoryId: categoriesMap[type.toLowerCase()],
            }
        })

        //Images

        const imagesData = images.map((image) => ({
            url: image,
            productId: dbProduct.id,
        }))

        await prisma.productImage.createMany({
            data: imagesData,
        })


    })
    

    
    console.log('seed ejecutado correctamente');
    

}



(() => {
    if(process.env.NODE_ENV === 'production') return
    main()
})();