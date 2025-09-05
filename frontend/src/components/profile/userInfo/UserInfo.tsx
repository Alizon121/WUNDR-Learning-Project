"use client";

import React, { useCallback, useEffect, useState } from "react"
import { makeApiRequest } from "../../../../utils/api"
import { User } from "@/types/user"
import { FaPen } from "react-icons/fa"
import UpdateUserForm from "./UpdateUserForm"
import OpenModalButton from "@/app/context/openModalButton"
import DeleteUser from "./DeleteUser"
import { e164toUS } from "../../../../utils/formatPhoneNumber";


const UserInfo = () => {
    const [loading, setLoading] = useState(true)
    const [loadErrors, setLoadErrors] = useState<string | null>(null)
    const [refreshKey, setRefreshKey] = useState(0)
    const [editing, setEditing] = useState(false)
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

    const handleEditing = () => !editing ? setEditing(true) : setEditing(false)
    const bumpRefresh = () => setRefreshKey(k => k + 1)

    return (
        <div>
            <div className="text-center mb-[35px]">
                <h1 className="text-4xl font-bold text-wondergreen mb-4">Your Account Information</h1>
                <div className="flex flex-row gap-2 max-w-2xl justify-center mx-auto">
                    <h2 className="text-lg text-wondergreen">Manage your profile</h2>
                    <FaPen onClick={handleEditing}/>
                </div>
            </div>

            {editing ? (
                <UpdateUserForm
                    currUser={user}
                    onSaved={() => {
                        bumpRefresh()
                        setEditing(false)
                    }}
                    onCancel={() => setEditing(false)}
                />
            ) : (
                <div className="bg-white shadow rounded-lg max-w-md mx-auto p-10">
                    <div className="space-y-2">
                        <div className="flex flex-row justify-around">
                            <div className="flex flex-col text-center">
                                <div className="mb-2">{user?.firstName} {user?.lastName}</div>
                                <div className="mb-2">{user?.email}</div>
                                <div className="mb-2">{e164toUS(user?.phoneNumber)}</div>
                                <div>{user?.address}</div>
                                <div>{user?.city}, {user?.state} {user?.zipCode}</div>
                                <div>Children</div>
                                {user?.children?.length ? (
                                    <ul className="list-disc pl-5">
                                        {user.children.map(child => (
                                            <li key={child.id}>{child.firstName} {child.lastName}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">No children yet.</p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            )}

            <OpenModalButton
                buttonText="DELETE ACCOUNT"
                className="block mx-auto mt-[100px] border rounded-lg py-3 px-5 bg-red-400 hover:bg-red-500 text-white"
                modalComponent={<DeleteUser currUser={user} />}
            />
        </div>
    )
}

export default UserInfo
