import { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";


interface State {

    cart: CartProduct[];

    //metodos
    getTotalItems: () => number;
    getSumaryInformation: () => {
        subTotal: number;
        tax: number;
        total: number;
        itemsInCart: number;
    }

    addProduct: (product: CartProduct) => void;
    updateProduct: (product: CartProduct, quantity: number) => void;
    removeProduct: (prodict: CartProduct) => void;

}


export const useCartStore = create<State>()(

    persist(
        (set,get) => ({
            cart: [],
            getTotalItems: () => {
                const {cart} = get()
                return cart.reduce((acc, curr) => acc + curr.quantity, 0)
            }, 
            getSumaryInformation() {
                const { cart} = get()
                const subTotal = cart.reduce((total, producto) => (producto.quantity * producto.price) + total,0)
                const tax = subTotal * 0.15
                const total = subTotal + tax
                const itemsInCart = cart.reduce((acc, curr) => acc + curr.quantity, 0)


                return {
                    subTotal,tax, total,itemsInCart
                }

            },
            addProduct: (product: CartProduct) => {
                const {cart} = get()            
    
                //1. Revisar si el prodcuto existe con la taya seleccionada
                const productInCart = cart.some(prod => prod.id === product.id && prod.size === product.size)
    
                if(!productInCart){
                    set({
                        cart: [...cart, product]
                    })
    
                    return
                }
    
                // 2 .Se que el producto existe por talla, tengo que incrementarlo
                const updatedCart = cart.map(prod => {
                    if(prod.id === product.id && prod.size === product.size){
                        return {
                            ...prod,
                            quantity: prod.quantity + product.quantity
                        }
                    }
    
                    return prod
                });
                set({cart: updatedCart})
            },
            updateProduct: (product: CartProduct, quantity: number) => {
                const {cart} = get()
                const updatedCartProduct = cart.map((item) => {
                    if(item.id === product.id && item.size === product.size){
                        return {
                            ...item,
                            quantity
                        }
                    }

                    return item
                })

                set({
                    cart: updatedCartProduct
                })

               
            },
            removeProduct: (product: CartProduct) => {
                const {cart} = get()
                const updatedCart = cart.filter(item => item.id !== product.id || item.size !== product.size)

                set({
                    cart: updatedCart
                })
            }
        }),
        {
            name: 'shopping-cart',
        }
    )
    
)