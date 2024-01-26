'use client'

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { CreateOrderData, CreateOrderActions, OnApproveActions, OnApproveData } from "@paypal/paypal-js"
import { paypalCheckPayment, setTransactionId } from "@/actions";


interface Props {
    orderId: string;
    amount: number;
}


export const PaypalBtn = ({ amount, orderId }: Props) => {
    const [{ isPending }] = usePayPalScriptReducer()

    const roundedAmount = (Math.round(amount * 100)) / 100

    if (isPending) {
        return (
            <div className="animate-pulse mb-16">
                <div className="h-11 mt-2 bg-gray-300 rounded" />
                <div className="h-11 mt-3 bg-gray-300 rounded" />
            </div>
        )
    }


    const createOrder = async (data: CreateOrderData, actions: CreateOrderActions): Promise<string> => {

        const transactionId = await actions.order.create({
            purchase_units: [
                {
                    invoice_id: orderId,
                    amount: {
                        value: `${roundedAmount}`,
                        currency_code: 'EUR'
                    }
                }
            ]
        })

        const { ok } = await setTransactionId(orderId, transactionId)

        if (!ok) {
            throw new Error('Error al crear la orden')
        }


        return transactionId;
    }

    const onAprove = async (data: OnApproveData, actions: OnApproveActions): Promise<void> => {
        const details = await actions.order?.capture()

        if (!details) return

        await paypalCheckPayment(details.id)
    }

    return (
        <PayPalButtons
            createOrder={createOrder}
            onApprove={onAprove}
        />
    )
}
