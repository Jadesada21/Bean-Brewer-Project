import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { api } from "../../AxiosInstance"

interface OrderItem {
    product_name: string
    price: number
    quantity: number
}

interface Order {
    order_id: number
    order_number: string
    status: string
    total_price: number
    items: OrderItem[]
}

interface UserInfo {
    email: string
    phone_num: string
    address_line: string
    province: string
    district: string
    subdistrict: string
}

interface AddressInfo {
    address_line: string
    province: string
    postal_code: string
    country: string
    district: string
    subdistrict: string
}

export default function PaymentPage() {

    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [order, setOrder] = useState<Order | null>(null)
    const [user, setUser] = useState<UserInfo | null>(null)
    const [addressUser, setAddressUser] = useState<AddressInfo | null>(null)

    useEffect(() => {
        const fetchData = async () => {

            if (!id) return
            const orderRes = await api.get(`/orders/${id}`)
            const userRes = await api.get('/users/me')
            const addressUserRes = await api.get('/addresses/primary')

            setOrder(orderRes.data.data)
            setUser(userRes.data.user)
            setAddressUser(addressUserRes.data.data)
            console.log(orderRes.data)
            console.log(userRes.data)
            console.log(addressUserRes.data)
        }
        fetchData()
    }, [id])


    useEffect(() => {
        if (id) return

        const createPayment = async () => {

            try {

                await api.post(`/payments/${id}`)

            } catch (err) {
                console.log(err)
            }
        }
        createPayment()
    }, [id])



    if (!order || !user || !addressUser) {
        return <div>Loading...</div>
    }


    const handlePayNow = async () => {
        try {

            await api.patch(`/payments/${order.order_id}/status`, {
                status: "completed"
            })

            navigate('/orders')

        } catch (err) {
            console.log(err)
        }
    }

    const handleCancel = async () => {
        if (!order) return

        try {
            await api.patch(`/payments/${order.order_id}/status`, {
                status: "cancelled"
            })

            navigate('/orders')

        } catch (err) {
            console.log(err)
        }
    }


    return (
        <div className="min-h-screen grid grid-cols-2 md:px-35 px-20 ">

            {/* LEFT SIDE */}

            <div className="px-16 py-12">

                <h1 className="text-3xl font-semibold mb-10">
                    Checkout
                </h1>

                <div className="space-y-4 text-gray-700">

                    <p>
                        <span className="font-semibold">Email:</span> {user.email}
                    </p>

                    <p>
                        <span className="font-semibold">Phone:</span> {user.phone_num}
                    </p>

                    <p>
                        <span className="font-semibold">Address:</span><br />

                        {addressUser.address_line}{""} ,
                        {addressUser.district}{""} ,
                        {addressUser.subdistrict}{""} ,
                        {addressUser.postal_code}{""} ,
                        {addressUser.province}{""} ,
                        {addressUser.country}{""} ,
                    </p>

                </div>

                {/* BUTTONS */}

                <div className="flex gap-4 mt-10">

                    <button
                        onClick={handleCancel}
                        className="px-6 py-3 border rounded-lg"
                    >
                        Cancel Order
                    </button>

                    <button
                        onClick={handlePayNow}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg"
                    >
                        Pay Now
                    </button>

                </div>

            </div>

            {/* RIGHT SIDE */}

            <div className="bg-gray-50 px-16 py-12">

                <h2 className="text-xl font-semibold mb-6">
                    Order Summary
                </h2>

                {/* ITEMS */}

                <div className="space-y-4 border-b pb-6">

                    {order.items?.map((item, i) => (

                        <div
                            key={i}
                            className="flex justify-between"
                        >

                            <div>
                                <p>{item.product_name}</p>
                                <p className="text-sm text-gray-500">
                                    Qty {item.quantity} × {item.price} ฿
                                </p>
                            </div>

                            <p>
                                {item.quantity * item.price} ฿
                            </p>

                        </div>

                    ))}

                </div>

                {/* TOTAL */}

                <div className="flex justify-between mt-6 text-lg font-semibold">

                    <p>Total</p>
                    <p>{order.total_price} ฿</p>

                </div>

            </div>

        </div>
    )
}