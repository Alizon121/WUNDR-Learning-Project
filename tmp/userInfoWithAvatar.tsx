// "use client";

// import React, { useCallback, useEffect, useRef, useState } from "react"
// import { makeApiRequest } from "../../../../utils/api"
// import { User } from "@/types/user"
// import { FaPen } from "react-icons/fa"
// import UpdateUserForm from "./UpdateUserForm"
// import OpenModalButton from "@/app/context/openModalButton"
// import DeleteUser from "./DeleteUser"
// import { e164toUS } from "../../../../utils/formatPhoneNumber";
// // import { ALLOWED } from "../../../../utils/normalizeImagesToJpeg";


// const UserInfo = () => {
//     const [loading, setLoading] = useState(true)
//     const [loadErrors, setLoadErrors] = useState<string | null>(null)
//     const [refreshKey, setRefreshKey] = useState(0)
//     const [editing, setEditing] = useState(false)
//     const [user, setUser] = useState<User | null>(null)
//     // const [preview, setPreview] = useState<string | null>(null)
//     // const fileInputRef = useRef<HTMLInputElement>(null)

//     const fetchUser = useCallback(async () => {
//         setLoading(true)

//         try {
//             const data = await makeApiRequest<User>("http://localhost:8000/user/me")
//             setUser(data)
//             setLoadErrors(null)
//         } catch (e) {
//             if (e instanceof Error) setLoadErrors(e.message)
//         } finally {
//             setLoading(false)
//         }
//     }, [])

//     useEffect(() => {
//         fetchUser()
//     }, [fetchUser, refreshKey])

//     // const openPicker = () => fileInputRef.current?.click()
//     // const handleChangeAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     //     const file = e.target.files?.[0]
//     //     if (!file) return

//     //     if (!ALLOWED.has(file.type)) {
//     //         console.error("Unsupportted image type", file.type)
//     //         return
//     //     }

//     //     if (file.size > 8 * 1024 * 1024) {
//     //         console.error("File too large (>8MB)")
//     //         return
//     //     }

//     //     const url = URL.createObjectURL(file)
//     //     setPreview(url)

//     //     try {
//     //         const formData = new FormData()
//     //         formData.append("avatar", file, file.name)

//     //         const avatar = await makeApiRequest(`http://localhost:8000/user`, {
//     //             method: "PUT",
//     //             body: formData
//     //         })

//     //         setUser(avatar)
//     //         setPreview(null)
//     //     } catch (err) {
//     //         console.error("avatar upload failed", err)
//     //         setPreview(null)
//     //     } finally {
//     //         URL.revokeObjectURL(url)
//     //         if (fileInputRef.current) fileInputRef.current.value = ""
//     //     }
//     // }

//     const handleEditing = () => !editing ? setEditing(true) : setEditing(false)
//     const bumpRefresh = () => setRefreshKey(k => k + 1)

//     return (
//         <div>
//             <div className="text-center mb-[35px]">
//                 <h1 className="text-4xl font-bold text-wondergreen mb-4">Your Account Information</h1>
//                 <div className="flex flex-row gap-2 max-w-2xl justify-center mx-auto">
//                     <h2 className="text-lg text-wondergreen">Manage your profile</h2>
//                     <FaPen onClick={handleEditing}/>
//                 </div>
//             </div>

//             {editing ? (
//                 <UpdateUserForm
//                     currUser={user}
//                     onSaved={() => {
//                         bumpRefresh()
//                         setEditing(false)
//                     }}
//                 />
//             ) : (
//                 <div className="bg-white shadow rounded-lg max-w-md mx-auto p-10">
//                     <div className="space-y-2">
//                         <div className="flex flex-row justify-around">
//                             {/* <div className="flex flex-col">
//                                 <img
//                                     className='h-24 w-24 rounded-full object-cover'
//                                     src={preview || user?.avatar || "./profile-picture.png"}
//                                     alt={`Profile Image of ${user?.firstName}`}
//                                 />

//                                 <button
//                                     type="button"
//                                     onClick={openPicker}
//                                     className="text-sm px-3 py-1 rounded border hover:bg-gray-50"
//                                 >
//                                     Change Avatar
//                                 </button>

//                                 <input
//                                     ref={fileInputRef}
//                                     type="file"
//                                     accept="image/*"
//                                     capture="user"
//                                     hidden
//                                     onChange={handleChangeAvatar}
//                                 />
//                             </div> */}

//                             <div className="flex flex-col text-center">
//                                 <div className="mb-2">{user?.firstName} {user?.lastName}</div>
//                                 <div className="mb-2">{user?.email}</div>
//                                 <div className="mb-2">{e164toUS(user?.phoneNumber)}</div>
//                                 <div>{user?.address}</div>
//                                 <div>{user?.city}, {user?.state}</div>
//                                 <div>{user?.zipCode}</div>
//                                 <div>Children</div>
//                                 {user?.children?.length ? (
//                                     <ul className="list-disc pl-5">
//                                         {user.children.map(child => (
//                                             <li key={child.id}>{child.firstName} {child.lastName}</li>
//                                         ))}
//                                     </ul>
//                                 ) : (
//                                     <p className="text-gray-500">No children yet.</p>
//                                 )}
//                             </div>
//                         </div>

//                     </div>
//                 </div>
//             )}

//             <OpenModalButton
//                 buttonText="DELETE ACCOUNT"
//                 className="block mx-auto mt-[100px] border rounded-lg py-3 px-5 bg-red-400 hover:bg-red-500 text-white"
//                 modalComponent={<DeleteUser currUser={user} />}
//             />
//         </div>
//     )
// }

// export default UserInfo
