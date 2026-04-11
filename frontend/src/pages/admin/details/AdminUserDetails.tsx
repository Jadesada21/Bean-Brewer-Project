import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { api } from "../../../AxiosInstance"
import { formatDate } from "../../../components/FormatDate"
import { formatNumeric } from "../../../components/FormatNumeric"
import type { UserDetail } from "../../../type/admin/detail/adminuserdetail.type"





export default function AdminUserDetails() {

    const { id } = useParams()

    const navigate = useNavigate()

    const [user, setUser] = useState<UserDetail | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchUserDetail = async () => {
        try {
            const { data } = await api.get(`/admin/users/detail/${id}`)
            setUser(data.data)
            console.log(data)
        } catch (err) {
            console.error('Error fetching users detail:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchUserDetail()
        }
    }, [id])


    if (!user) return <div>User not found</div>


    const defaultAddress = user?.addresses.find(a => a.is_default)
    const otherAddresses = user?.addresses.filter(a => !a.is_default) || []



    if (loading) {
        return <div>loading...</div>
    }



    return (
        <div className="font-baskerville ml-30">
            <div className="mt-10 bg-white p-8 rounded-xl shadow-sm max-w-3xl mb-10 h-full">

                <h2 className="text-xl font-semibold mb-6">
                    # {user.id}
                </h2>


                <div className="grid grid-cols-2 pt-4">
                    <h2 className="text-xl font-semibold">
                        Username
                    </h2>



                    <h2 className="text-xl font-semibold">
                        Email
                    </h2>
                </div>



                <div className="grid grid-cols-2 pt-2 pb-2">
                    <h2 className="text-xl font-semibold">
                        {user.username}
                    </h2>



                    <h2 className="text-xl font-semibold">
                        {user.email}
                    </h2>
                </div>


                <div className="grid grid-cols-2 pt-4 border-t">
                    <h2 className="text-xl font-semibold">
                        Firstname
                    </h2>



                    <h2 className="text-xl font-semibold">
                        Lastname
                    </h2>
                </div>

                <div className="grid grid-cols-2 pt-2 pb-2">
                    <p className="text-xl font-semibold">
                        {user.first_name}
                    </p>

                    <p className="text-xl font-semibold">
                        {user.last_name}
                    </p>
                </div>

                <div className="grid grid-cols-2 pt-4 border-t">
                    <h2 className="text-xl font-semibold">
                        Phone Number
                    </h2>



                    <h2 className="text-xl font-semibold">
                        Role
                    </h2>
                </div>

                <div className="grid grid-cols-2 pt-2 pb-2">
                    <h2 className="text-xl font-semibold">
                        {user.phone_num}
                    </h2>



                    <h2 className="text-xl font-semibold">
                        {user.role}
                    </h2>
                </div>

                <div className="grid grid-cols-2 pt-4 border-t">
                    <h2 className="text-xl font-semibold">
                        Points
                    </h2>



                    <h2 className="text-xl font-semibold">
                        Is Active
                    </h2>
                </div>

                <div className="grid grid-cols-2 pt-2 pb-2">
                    <h2 className="text-xl font-semibold">
                        {formatNumeric(user.points)}
                    </h2>



                    <h2 className="text-xl font-semibold">
                        {user.is_active ? "Active" : "Inactive"}
                    </h2>
                </div>

                <div className="grid grid-cols-2 pt-4 border-t">
                    <h2 className="text-xl font-semibold">
                        Created
                    </h2>



                    <h2 className="text-xl font-semibold">
                        Updated
                    </h2>
                </div>

                <div className="grid grid-cols-2 pt-2 pb-2">
                    <h2 className="text-xl font-semibold">
                        {formatDate(user.created_at)}
                    </h2>



                    <h2 className="text-xl font-semibold">
                        {formatDate(user.updated_at)}
                    </h2>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={() => navigate("/admin/users")}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-red-600"
                    >
                        Back
                    </button>
                </div>
            </div>


            <div className="mt-10 bg-white p-8 rounded-xl shadow-sm max-w-3xl mb-10 h-full">
                {defaultAddress ? (
                    <div>
                        <div>
                            <h2 className="text-xl font-semibold pb-5">
                                Default Address
                            </h2>
                        </div>

                        {/* Address line */}
                        <div className="pt-4 pb-2">
                            <h2 className="text-xl font-semibold">
                                Address line
                            </h2>
                        </div>

                        <div className="text-xl font-semibold pt-2 pb-2">
                            {defaultAddress.address_line}
                        </div>

                        {/* sub district + district */}
                        <div className="grid grid-cols-2 pt-4 pb-2 border-t">
                            <h2 className="text-xl font-semibold">
                                Sub District
                            </h2>

                            <h2 className="text-xl font-semibold">
                                District
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 pt-4 pb-2">
                            <h2 className="text-xl font-semibold">
                                {defaultAddress.subdistrict}
                            </h2>

                            <h2 className="text-xl font-semibold">
                                {defaultAddress.district}
                            </h2>
                        </div>

                        {/* province postal code */}
                        <div className="grid grid-cols-2 pt-4 pb-2 border-t">
                            <h2 className="text-xl font-semibold">
                                Province
                            </h2>

                            <h2 className="text-xl font-semibold">
                                Postal Code
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 pt-4 pb-2">
                            <h2 className="text-xl font-semibold">
                                {defaultAddress.province}
                            </h2>

                            <h2 className="text-xl font-semibold">
                                {defaultAddress.postal_code}
                            </h2>
                        </div>

                        {/* country */}
                        <div className="pt-4 pb-2 border-t">
                            <h2 className="text-xl font-semibold">
                                Country
                            </h2>
                        </div>

                        <div className="text-xl font-semibold pt-2 pb-2">
                            {defaultAddress.country}
                        </div>
                    </div>
                ) : (
                    <p>
                        No Address
                    </p>
                )}
            </div>

            {otherAddresses.length > 0 && (
                <div className="mt-10 bg-white p-8 rounded-xl shadow-sm max-w-3xl mb-10 h-full">
                    <div>
                        <div>
                            <h2 className="text-xl font-semibold pb-5">
                                Other Address
                            </h2>
                        </div>

                        {/* Address line */}
                        {otherAddresses.map(a => (
                            <div
                                key={a.id}
                            >
                                <div className="pt-4 pb-2">
                                    <h2 className="text-xl font-semibold">
                                        Address line
                                    </h2>
                                </div>

                                <div className="text-xl font-semibold pt-2 pb-2">
                                    {a.address_line}
                                </div>

                                {/* sub district + district */}
                                <div className="grid grid-cols-2 pt-4 pb-2 border-t">
                                    <h2 className="text-xl font-semibold">
                                        Sub District
                                    </h2>

                                    <h2 className="text-xl font-semibold">
                                        District
                                    </h2>
                                </div>

                                <div className="grid grid-cols-2 pt-4 pb-2">
                                    <h2 className="text-xl font-semibold">
                                        {a.subdistrict}
                                    </h2>

                                    <h2 className="text-xl font-semibold">
                                        {a.district}
                                    </h2>
                                </div>

                                {/* province postal code */}
                                <div className="grid grid-cols-2 pt-4 pb-2 border-t">
                                    <h2 className="text-xl font-semibold">
                                        Province
                                    </h2>

                                    <h2 className="text-xl font-semibold">
                                        Postal Code
                                    </h2>
                                </div>

                                <div className="grid grid-cols-2 pt-4 pb-2">
                                    <h2 className="text-xl font-semibold">
                                        {a.province}
                                    </h2>

                                    <h2 className="text-xl font-semibold">
                                        {a.postal_code}
                                    </h2>
                                </div>

                                {/* country */}
                                <div className="pt-4 pb-2 border-t">
                                    <h2 className="text-xl font-semibold">
                                        Country
                                    </h2>
                                </div>

                                <div className="text-xl font-semibold pt-2 pb-2">
                                    {a.country}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

