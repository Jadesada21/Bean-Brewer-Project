import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { api } from "../../AxiosInstance"

interface OrderItem {
    product_name: string
    price: number
    quantity: number
    image_url: string
}

interface Order {
    order_id: number
    order_number: string
    status: string
    total_price: number
    payment_id: number
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
        if (!id) return

        const createPayment = async () => {
            try {
                await api.post(`/payments/${id}`)

                const updatedOrder = await api.get(`/orders/${id}`)
                setOrder(updatedOrder.data.data)
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

            await api.patch(`/payments/${order.payment_id}/status`, {
                status: "completed"
            })

            navigate('/profile/payments')

        } catch (err) {
            console.log(err)
        }
    }

    const handleCancel = async () => {
        if (!order) return

        try {
            await api.patch(`/payments/${order.payment_id}/status`, {
                status: "cancelled"
            })

            navigate('/profile/payments')

        } catch (err) {
            console.log(err)
        }
    }


    return (
        <div className="h-full flex md:px-35 px-20 justify-center font-baskerville">

            {/* LEFT SIDE */}

            <div className="px-16 py-12 border-r border-gray-200 border-b  ">

                <h1 className="text-xl font-semibold mb-10 text-center">
                    Checkout
                </h1>

                <div className="space-y-4 text-gray-700">

                    <p>
                        <span className="font-semibold">Email:</span> {user.email}
                    </p>

                    <p>
                        <span className="font-semibold">Phone:</span> {user.phone_num}
                    </p>

                    <div>
                        <span className="font-semibold">Address:</span><br />

                        <div className="pt-2">
                            {addressUser.address_line}{""} ,
                        </div>

                        <div className="pt-2">
                            {addressUser.district}{""} ,
                            {addressUser.subdistrict} ,
                        </div>
                        <div className="pt-2">
                            {addressUser.postal_code}{""} ,
                            {addressUser.province}{""} ,
                            {addressUser.country}{""}
                        </div>
                    </div>

                </div>

                {/* BUTTONS */}

                <div className="flex gap-4 mt-10">

                    <button
                        onClick={handleCancel}
                        className="px-6 py-3 border rounded-lg bg-red-500 opacity-50 text-white cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                    >
                        Cancel Order
                    </button>

                    <button
                        onClick={handlePayNow}
                        className="px-6 py-3 bg-green-600 text-white opacity-50 rounded-lg cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                    >
                        Pay Now
                    </button>

                </div>

            </div>

            {/* RIGHT SIDE */}

            <div className="bg-[#d8d8d885] px-16 py-12 w-100 border-b border-gray-200">

                <h2 className="text-xl font-semibold mb-6 ">
                    Summary
                </h2>

                {/* ITEMS */}

                <div className="space-y-4 border-b pb-6">

                    {order.items?.map((item, i) => (

                        <div
                            key={i}
                            className="flex justify-center xl:justify-between"
                        >

                            <div className="flex flex-col xl:flex-row gap-4 xl:gap-6 items-center xl:items-start text-center xl:text-left">
                                <img src={item.image_url}
                                    className="w-20 h-20 xl:w-16 xl:h-16 object-cover rounded border border-white"
                                />

                                <div>
                                    <p>{item.product_name}</p>
                                    <p className="text-sm text-gray-500">
                                        Qty {item.quantity} × {item.price} ฿
                                    </p>
                                </div>
                            </div>
                        </div>

                    ))}

                </div>

                {/* TOTAL */}

                <div className="flex flex-col xl:flex-row items-center xl:items-center text-center xl:text-left xl:justify-between gap-2 xl:gap-0  mt-6 text-lg font-semibold">

                    <p>Total</p>
                    <p>{order.total_price} ฿</p>

                </div>

            </div>

        </div>
    )
}