import { useCallback, useEffect, useState } from "react"
import { makeApiRequest } from "../../../../utils/api"
import { User } from "@/types/user"


const UserInfo = () => {
    const [loading, setLoading] = useState(true)
    const [loadErrors, setLoadErrors] = useState<string | null>(null)
    const [refreshKey, setRefreshKey] = useState(0)
    const [user, setUser] = useState<User | null>(null)

    const fetchUser = useCallback(async () => {
        setLoading(true)

        try {
            const data = await makeApiRequest<User>("http://localhost:8000/user/me")
            setUser(data)
            setLoadErrors(null)
        } catch (e) {
            if (e instanceof Error) setLoadErrors(e.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchUser()
    }, [fetchUser, refreshKey])


    return (
        <div>
            <div className="text-center mb-[40px]">
                <h1 className="text-4xl font-bold text-wondergreen mb-4">Your Account Information</h1>
                <h2 className="max-w-2xl mx-auto text-lg text-wondergreen">Manage your profile</h2>
            </div>

            <div className="bg-white shadow rounded-lg max-w-md mx-auto p-6">
                <div className="space-y-2">
                    <div><span className="font-medium">First name:</span> {user?.firstName}</div>
                    <div><span className="font-medium">Last name:</span> {user?.lastName}</div>
                    <div><span className="font-medium">Email:</span> {user?.email}</div>
                    {/* <div><span className="font-medium">Avatar:</span> {user?.avatar}</div> */}
                    <div><span className="font-medium">City:</span> {user?.city}</div>
                    <div><span className="font-medium">State:</span> {user?.state}</div>
                    <div><span className="font-medium">Zip Code:</span> {user?.zipCode}</div>
                </div>
            </div>


        </div>
    )
}

export default UserInfo
