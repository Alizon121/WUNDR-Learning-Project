import React, { useEffect, useState, useCallback } from "react"
import { makeApiRequest } from "../../../../utils/api"
import { Child } from "@/types/child"
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6"
import { FaPen, FaTrash } from "react-icons/fa"
import JoinChildForm from "./JoinChildForm"

const JoinChild = () => {
    const [children, setChildren] = useState<Child[]>([])
    const [loadErrors, setLoadErrors] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [showForm, setShowForm] = useState<boolean>(false)
    const [currChildIdx, setCurrChildIdx] = useState<number>(0)
    const [refreshKey, setRefreshKey] = useState(0)

    const fetchChildren = useCallback(async () => {
        setLoading(true)

        try {
            const response = await makeApiRequest("http://localhost:8000/child/current")
            const allChildren: Child[] = response as Child[]
            setChildren(allChildren)
            setLoadErrors(null)
            setCurrChildIdx(prev => (allChildren.length ? Math.min(prev, allChildren.length - 1) : 0));

        } catch (e) {
            if (e instanceof Error) setLoadErrors(e.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchChildren()
    }, [fetchChildren, refreshKey])

    const handleFormSuccess = (createdChild?: Child) => {
        setShowForm(false)
        if (createdChild) {
            setChildren(prev => [createdChild, ...prev])
            setCurrChildIdx(0)
        } else {
            setRefreshKey(counter => counter + 1)
        }
    }

    const visibleChildren = Array.from({ length: Math.min(2, children.length) }, (_, i) => {
        const idx = (((currChildIdx + i) % children.length) + children.length) % children.length
        return children[idx]
    })

    const handleNext = () => {
        if (children.length > 0) setCurrChildIdx((prevIdx) => (((prevIdx + 1) % children.length) + children.length) % children.length)
    }

    const handlePrev = () => {
        if (children.length > 0) setCurrChildIdx((prevIdx) => (((prevIdx - 1) % children.length) + children.length) % children.length)
    }

    const handleShowForm = () => !showForm ? setShowForm(true) : setShowForm(false)

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: "numeric",
            day: "numeric",
            year: "numeric"
        })
    }

    return (
        <div>
            <div className="text-center mb-[40px]">
                <h1 className="text-4xl font-bold text-wondergreen mb-4">Your Children's Information</h1>
                <h2 className="max-w-2xl mx-auto text-lg text-wondergreen">Manage your children's profile for their events</h2>
            </div>

            <button
                onClick={handleShowForm}
                className="flex items-center mb-30 bg-wonderleaf border-none py-[12px] px-[24px] text-base rounded-md cursor-pointer mb-30 mx-auto">
                    Add a child?
            </button>

            <div className="flex flex-row gap-6 my-10">
                {children.length > 2 && (
                    <FaCircleChevronLeft className="w-[50px] h-50px cursor-pointer my-auto" onClick={handlePrev}/>
                )}

                {visibleChildren.map((child) => (
                    <div key={child.id} className="basis-1/2">
                        <div className="bg-white rounded-lg p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div className="font-bold text-xl">
                                    {child.firstName} {child.lastName}
                                </div>

                                <div className="flex flex-row gap-2">
                                    <FaPen />
                                    <FaTrash />
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="font-bold">BIRTHDAY</div>
                                <div className="text-black mb-1">
                                    {child.birthday ? formatDate(child.birthday) : "—"}
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="font-bold">HOMESCHOOL PROGRAM</div>
                            </div>

                            <div className="mb-4 border-t pt-4">
                                <div className="font-bold">NOTES/ACCOMMODATIONS</div>
                            </div>
                        </div>
                    </div>
                ))}

                {children.length > 2 && (
                    <FaCircleChevronRight className="w-[50px] h-50px cursor-pointer my-auto" onClick={handleNext}/>
                )}
            </div>

            <JoinChildForm showForm={showForm} onSuccess={handleFormSuccess}/>
        </div>

    )
}

export default JoinChild
