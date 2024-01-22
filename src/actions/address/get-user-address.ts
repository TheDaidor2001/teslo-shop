'use server'
import prisma from "@/lib/prisma";



export const getUserAddress = async (userId: string) => {
    try {
        
        const address = await prisma.userAddress.findUnique({
            where: {userId}
        })

        if(!address) return null


        const {countryId, addressTwo, ...rest} = address

        return {
            ...rest,
            country: countryId,
            addressTwo: addressTwo ? addressTwo : '',
            city: 'Hola'
        }

    } catch (error) {
        console.log(error);
        return null
        
    }
}