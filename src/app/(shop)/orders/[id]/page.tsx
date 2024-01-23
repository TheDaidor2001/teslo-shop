/* eslint-disable react/no-unescaped-entities */
import { getOrderById } from "@/actions/order/get-order-by-id";
import { Title } from "@/components";
import { currencyFormat } from "@/utils";
import clsx from "clsx";

import Image from "next/image";
import { redirect } from "next/navigation";
import { IoCardOutline } from "react-icons/io5";



interface Props {
    params: {
        id: string
    }
}


export default async function CheckoutPage({ params }: Props) {

    const { id } = params


    //TODO llamar server action
    const { ok, order } = await getOrderById(id)

    if (!ok) {
        redirect('/')
    }

    const address = order?.OrderAddress


    return (
        <div className="flex justify-center items-center mb-72 px-10 sm:px-0">

            <div className="flex flex-col w-[1000px]">

                <Title title={`Orden nº${id.split('-').at(-1)}`} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    {/**Carrito */}
                    <div className="flex flex-col mt-5">
                        <div className={
                            clsx(
                                "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                                {
                                    'bg-red-500': !order?.isPaid,
                                    'bg-green-700': order?.isPaid,
                                }
                            )
                        }>
                            <IoCardOutline size={30} />
                            {/* <span className="mx-2">Pendiente de pago</span> */}
                            <span className="mx-2">
                                {order?.isPaid ? 'Pagado' : 'Pendiente de pago'}
                            </span>
                        </div>

                        {/**Items */}

                        {
                            order?.OrderItem.map(item => (
                                <div key={item.product.slug + '-' + item.size} className="flex mb-5">
                                    <Image
                                        src={`/products/${item.product.ProductImages[0].url}`}
                                        alt={item.product.title}
                                        width={100}
                                        height={100}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                        }}
                                        className="mr-5 rounded"
                                    />

                                    <div>
                                        <p>{item.product.title}</p>
                                        <p>{currencyFormat(item.price)} x 3</p>
                                        <p className="font-bold"> Subtotal: ${currencyFormat(item.price * item.quantity)}</p>                                    </div>
                                </div>
                            ))
                        }
                    </div>


                    {/**checkout */}
                    <div className="bg-white rounded-xl shadow-xl p-7">

                        <h2 className="text-2xl mb-2 ">Dirección de entrega</h2>
                        <div className="mb-10">
                            <p className="text-xl">{address!.firstName} - {address!.lastName}</p>
                            <p>{address!.address}</p>
                            <p>{address!.addressTwo}</p>
                            <p>{address!.postalCode}</p>
                            <p>{address!.phone}</p>
                        </div>

                        {/**divider */}
                        <div className="w-full h-0.5 bg-gray-200 mb-10" />

                        <h2 className="text-2xl mb-2 ">Resumen del pedido</h2>

                        <div className="grid grid-cols-2">
                            <span>No. Productos</span>
                            <span className="text-right">{order!.itemsInOrder === 1 ? '1 Artículo' : `${order!.itemsInOrder} Artículos`}</span>

                            <span>Subtotal</span>
                            <span className="text-right">{currencyFormat(order!.subTotal)}</span>

                            <span className="text-sm">Impuestos (15%)</span>
                            <span className="text-right text-sm">{currencyFormat(order!.tax)}</span>

                            <span className="text-2xl mt-5">Total: </span>
                            <span className="text-right mt-5 text-2xl">{currencyFormat(order!.total)}</span>
                        </div>

                        <div className="mt-5 mb-2 w-full">
                            <div className={
                                clsx(
                                    "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                                    {
                                        'bg-red-500': !order?.isPaid,
                                        'bg-green-700': order?.isPaid,
                                    }
                                )
                            }>
                                <IoCardOutline size={30} />
                                {/* <span className="mx-2">Pendiente de pago</span> */}
                                {order?.isPaid ? 'Pagado' : 'Pendiente de pago'}
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}