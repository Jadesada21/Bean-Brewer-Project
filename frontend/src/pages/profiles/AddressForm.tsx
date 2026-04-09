import { useEffect, useState } from 'react'
import { api } from '../../AxiosInstance'
import type { Address } from '../../type/profile/addessform.type'



export default function AddressForm() {

    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [showOtherHeader, setShowOtherHeader] = useState(true)

    const [defaultAddress, setDefaultAddress] = useState<Address | null>(null)
    const [otherAddresses, setOtherAddresses] = useState<Address[]>([])

    const [showCreateModal, setShowCreateModal] = useState(false)

    const [form, setForm] = useState({
        address_line: "",
        province: "",
        postal_code: "",
        country: "",
        district: "",
        subdistrict: ""

    })

    const [loading, setLoading] = useState(true)

    const fetchAddress = async () => {
        try {
            const res = await api.get('/addresses/me')
            const data: Address[] = res.data.data

            const defaultAddr = data.find(a => a.is_default) || null

            const others = data.filter(a => !a.is_default)


            setDefaultAddress(defaultAddr)
            setOtherAddresses(others)

            if (defaultAddr) {
                setForm({
                    address_line: defaultAddr.address_line ?? "",
                    province: defaultAddr.province ?? "",
                    postal_code: defaultAddr.postal_code ?? "",
                    country: defaultAddr.country ?? "",
                    district: defaultAddr.district ?? "",
                    subdistrict: defaultAddr.subdistrict ?? ""

                })
            }

        } catch (err) {
            console.log("Fetch address error", err);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAddress()
    }, [])


    const addAddress = async () => {
        try {
            await api.post('/addresses', form)
            alert("Add address success")

            setForm({
                address_line: "",
                province: "",
                postal_code: "",
                country: "",
                district: "",
                subdistrict: ""
            })
            await fetchAddress()
        } catch (err) {
            console.log("Add address error", err);
            alert("Add address failed")
        }
    }

    const setDefaultAddressHandler = async (id: number) => {
        try {
            await api.patch(`/addresses/${id}/default`)
            await fetchAddress()
        } catch (err) {
            console.error(err)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async () => {
        try {
            if (!editingId) {
                console.error("editingId is null")
                return
            }

            let payload

            if (editingId === defaultAddress?.id) {
                payload = form
            } else {

                const addr = otherAddresses.find(a => a.id === editingId)

                if (!addr) {
                    console.error("Address not found")
                    return
                }

                payload = {
                    address_line: addr.address_line,
                    province: addr.province,
                    postal_code: addr.postal_code,
                    country: addr.country,
                    district: addr.district,
                    subdistrict: addr.subdistrict
                }
            }

            await api.patch(`/addresses/update/${editingId}`, payload)

            await fetchAddress()

            setIsEditing(false)
            setEditingId(null)
            setShowOtherHeader(true)

        } catch (err) {
            console.error("Update profile failed", err)
        }
    }

    const handleAddressChange = (
        id: number,
        field: keyof Address,
        value: string
    ) => {
        setOtherAddresses(prev =>
            prev.map(addr =>
                addr.id === id
                    ? { ...addr, [field]: value }
                    : addr
            )
        )
    }

    if (loading) {
        return <div>Loading...</div>
    }



    return (
        <div className="font-baskerville">
            <div className="mt-8 pl-3">
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="border bg-green-500 w-30 h-10 text-white rounded cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                >
                    {!defaultAddress ? "Create +" : "Add More +"}
                </button>
            </div>

            {defaultAddress ? (
                <div className="mt-10 bg-white p-8 rounded-xl shadow-sm max-w-3xl mb-10">
                    {/* header */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold "
                        >Personal Addresses
                        </h2>

                        {!isEditing && (
                            <button
                                onClick={() => {
                                    setEditingId(defaultAddress?.id || null)
                                    setIsEditing(true)
                                }}
                                className="border px-4 py-2 rounded  cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                            >
                                Edit
                            </button>
                        )}
                    </div>

                    {/* fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-2 ">address</label>
                            <input
                                type='text'
                                name="address_line"
                                value={form.address_line}
                                onChange={handleChange}
                                placeholder='address'
                                maxLength={60}
                                disabled={!isEditing}
                                className="w-full rounded border border-gray-300 h-10 pl-2 "
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2 ">subdistrict</label>
                                <input
                                    type='text'
                                    name="subdistrict"
                                    value={form.subdistrict}
                                    onChange={handleChange}
                                    placeholder='subdistrict'
                                    maxLength={30}
                                    disabled={!isEditing}
                                    className="w-full rounded border border-gray-300 h-10 pl-2 "
                                />
                            </div>
                            <div>
                                <label className="block mb-2 ">district</label>
                                <input
                                    type='text'
                                    name="district"
                                    value={form.district}
                                    onChange={handleChange}
                                    placeholder='district'
                                    maxLength={20}
                                    disabled={!isEditing}
                                    className="w-full rounded border border-gray-300 h-10 pl-2 "
                                />
                            </div>
                        </div>



                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2 ">province</label>
                                <input
                                    type='text'
                                    name="province"
                                    value={form.province}
                                    onChange={handleChange}
                                    placeholder='province'
                                    maxLength={20}
                                    disabled={!isEditing}
                                    className="w-full rounded border border-gray-300 h-10 pl-2 "
                                />
                            </div>

                            <div>
                                <label className="block mb-2 ">postal_code</label>
                                <input
                                    type='text'
                                    name="postal_code"
                                    value={form.postal_code}
                                    onChange={handleChange}
                                    placeholder='postalcode'
                                    maxLength={5}
                                    disabled={!isEditing}
                                    className="w-full rounded border border-gray-300 h-10 pl-2 "
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 ">country</label>
                            <input
                                type='text'
                                name="country"
                                value={form.country}
                                onChange={handleChange}
                                placeholder='country'
                                maxLength={30}
                                disabled={!isEditing}
                                className="w-full rounded border border-gray-300 h-10 pl-2 "
                            />
                        </div>
                    </div>

                    {/* buttons */}
                    {isEditing && (
                        <div className="flex gap-4 mt-8">

                            <button
                                onClick={handleSubmit}
                                className="bg-black text-white px-6 py-2 rounded  cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                            >
                                Save
                            </button>

                            <button
                                onClick={() => setIsEditing(false)}
                                className="border px-6 py-2 rounded  cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            ) : (

                // No address
                <div className="mt-10 bg-white p-8 rounded-xl shadow-sm max-w-3xl mb-10 text-center">
                    <p className="text-gray-500 text-lg">No address</p>
                </div>
            )}


            {/* other address */}
            {otherAddresses.length > 0 && (
                <div className="mt-10 bg-white p-8 rounded-xl shadow-sm max-w-3xl mb-10">

                    {otherAddresses.map(addr => {
                        const isAddressEditing = editingId === addr.id

                        return (

                            <div key={addr.id} className="space-y-4">
                                {/* header */}
                                {showOtherHeader && (
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-2xl font-bold ">Other Address</h3>

                                        <button
                                            onClick={() => {
                                                setShowOtherHeader(false)
                                                setEditingId(addr.id)
                                            }}
                                            className="border px-4 py-2 rounded cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                )}

                                {/* address line */}
                                <div>
                                    <label className="block mb-2 ">address</label>
                                    {isAddressEditing ? (
                                        <input
                                            type="text"
                                            value={addr.address_line}
                                            onChange={(e) =>
                                                handleAddressChange(addr.id, 'address_line', e.target.value)
                                            }
                                            placeholder='Address'
                                            maxLength={100}
                                            className="w-full rounded border border-gray-300 h-10 pl-2 "
                                        />
                                    ) : (
                                        <p className="">{addr.address_line}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-2 ">subdistrict</label>
                                        {isAddressEditing ? (
                                            <input
                                                type='text'
                                                value={addr.subdistrict}
                                                onChange={(e) =>
                                                    handleAddressChange(addr.id, 'subdistrict', e.target.value)
                                                }
                                                placeholder='subdistrict'
                                                maxLength={30}
                                                className="w-full rounded border border-gray-300 h-10 pl-2 "
                                            />
                                        ) : (
                                            <p>{addr.subdistrict}</p>
                                        )}

                                    </div>

                                    <div>
                                        <label className="block mb-2 ">district</label>
                                        {isAddressEditing ? (
                                            <input
                                                type='text'
                                                value={addr.district}
                                                onChange={(e) =>
                                                    handleAddressChange(addr.id, 'district', e.target.value)
                                                }
                                                placeholder='district'
                                                maxLength={20}
                                                className="w-full rounded border border-gray-300 h-10 pl-2 "
                                            />
                                        ) : (
                                            <p>{addr.district}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-2 ">province</label>
                                        {isAddressEditing ? (
                                            <input
                                                type='text'
                                                value={addr.province}
                                                onChange={(e) =>
                                                    handleAddressChange(addr.id, 'province', e.target.value)
                                                }
                                                placeholder='province'
                                                maxLength={20}
                                                className="w-full rounded border border-gray-300 h-10 pl-2 "
                                            />
                                        ) : (
                                            <p className="">{addr.province}</p>
                                        )}

                                    </div>

                                    <div>
                                        <label className="block mb-2 ">postal_code</label>
                                        {isAddressEditing ? (
                                            <input
                                                type='text'
                                                value={addr.postal_code}
                                                onChange={(e) =>
                                                    handleAddressChange(addr.id, 'postal_code', e.target.value)
                                                }
                                                placeholder='postalcode'
                                                maxLength={5}
                                                className="w-full rounded border border-gray-300 h-10 pl-2 "
                                            />
                                        ) : (
                                            <p className="">{addr.postal_code}</p>
                                        )}

                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-2 ">country</label>
                                    {isAddressEditing ? (
                                        <input
                                            type='text'
                                            value={addr.country}
                                            onChange={(e) =>
                                                handleAddressChange(addr.id, 'country', e.target.value)
                                            }
                                            placeholder='country'
                                            maxLength={30}
                                            className="w-full rounded border border-gray-300 h-10 pl-2 "
                                        />
                                    ) : (
                                        <p className="">{addr.country}</p>
                                    )}
                                </div>

                                {!addr.is_default && !isAddressEditing && (
                                    <button
                                        onClick={() => setDefaultAddressHandler(addr.id)}
                                        className="h-10 mt-3 px-3 py-1 bg-blue-500 text-white rounded cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                                    >
                                        Set as Default
                                    </button>
                                )}

                                {editingId === addr.id && (
                                    <div className="flex gap-4 mt-8">

                                        <button
                                            onClick={() => {
                                                handleSubmit()
                                                setEditingId(null)
                                                setShowOtherHeader(true)
                                            }}
                                            className="bg-black text-white px-6 py-2 rounded  cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                                        >
                                            Save
                                        </button>

                                        <button
                                            onClick={() => {
                                                setEditingId(null)
                                                setShowOtherHeader(true)
                                            }}
                                            className="border px-6 py-2 rounded  cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            {showCreateModal && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
                    onClick={() => setShowCreateModal(false)}
                >
                    <div className="bg-white p-8 rounded-xl w-150"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold mb-4">Add Address</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block mb-2 ">address</label>
                                <input
                                    type='text'
                                    name="address_line"
                                    value={form.address_line}
                                    onChange={handleChange}
                                    placeholder='address'
                                    maxLength={60}
                                    className="w-full rounded border border-gray-300 h-10 pl-2 "
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 ">subdistrict</label>
                                    <input
                                        type='text'
                                        name="subdistrict"
                                        value={form.subdistrict}
                                        onChange={handleChange}
                                        placeholder='subdistrict'
                                        maxLength={30}
                                        className="w-full rounded border border-gray-300 h-10 pl-2 "
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 ">district</label>
                                    <input
                                        type='text'
                                        name="district"
                                        value={form.district}
                                        onChange={handleChange}
                                        placeholder='district'
                                        maxLength={20}
                                        className="w-full rounded border border-gray-300 h-10 pl-2 "
                                    />
                                </div>
                            </div>



                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 ">province</label>
                                    <input
                                        type='text'
                                        name="province"
                                        value={form.province}
                                        onChange={handleChange}
                                        placeholder='province'
                                        maxLength={20}
                                        className="w-full rounded border border-gray-300 h-10 pl-2 "
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 ">postal_code</label>
                                    <input
                                        type='text'
                                        name="postal_code"
                                        value={form.postal_code}
                                        onChange={handleChange}
                                        placeholder='postalcode'
                                        maxLength={5}
                                        className="w-full rounded border border-gray-300 h-10 pl-2 "
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block mb-2 ">country</label>
                                <input
                                    type='text'
                                    name="country"
                                    value={form.country}
                                    onChange={handleChange}
                                    placeholder='country'
                                    maxLength={30}
                                    className="w-full rounded border border-gray-300 h-10 pl-2 "
                                />
                            </div>
                        </div>

                        {/* buttons */}
                        <div className="flex justify-end gap-2 mt-5">
                            <button
                                onClick={async () => {
                                    await addAddress()
                                    setShowCreateModal(false)
                                }}
                                className="px-4 py-2 bg-green-500 text-white rounded"
                            >
                                Save
                            </button>

                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    )
}