

export const generatePagination = (currentPage: number, totalPages:number) => {
    //Si el numero total de paginas es 7 o menos mostrar todas las paginas sin puntos
    
    if(totalPages <= 7){
        return Array.from({length: totalPages}, (_, i) => i+1);
    }

    //Si la pagina actual esta netre las primeras tres paginas 
    //Mostrar las primeras 3 paginas, puntos suspensivos y las ultimas 2
    if(currentPage <= 3){
        return [1,2,3,'...',totalPages-1, totalPages]
    }

    //si la pagina actual esta entre las ultimas 3 paginas
    //mostrar las primeras 2 paginas, puntos suspensivos y las ultimas 3

    if(currentPage >= totalPages - 2){
        return [1,2,'...',totalPages-2,totalPages-1,totalPages]
    }

    //Si la pagina actual esta en otro lugar medio
    //mostrar la primersa pagina, puntos suspensivos, pagina actual
    return [
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages
    ]
}