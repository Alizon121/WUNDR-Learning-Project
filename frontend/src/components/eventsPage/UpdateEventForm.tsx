"use client"

import { useParams } from "next/navigation"
import { useEvent } from "../../../hooks/useEvent"
import { Event } from "@/types/event"
import { useEffect, useState } from "react"
import { CITIES_CO } from '@/data/citiesCO';
import { US_States } from '@/data/states';
import { Activity } from '@/types/activity';
import { makeApiRequest } from "../../../utils/api"

type ActivitiesResponse = { activities: Activity[] }

export default function UpdateEventForm() {
    const { eventId } = useParams()
    const { event, loading, error, refetch } = useEvent(eventId)
    const [formEvent, setFormEvent] = useState<Event | null>(null)
    const [activities, setActivities] = useState<Activity[]>()

    useEffect(() => {
        if (event) {
            setFormEvent(event)
        }
    }, [event])

    useEffect(() => {
        // create async helper function to get activities
        const getActivities = async () => {
            try {
                let fetchActivities: ActivitiesResponse = await makeApiRequest("http://localhost:8000/activity")
                if (fetchActivities.activities) setActivities(fetchActivities.activities)
            } catch {
                throw Error("Unable to fetch activities")
            }
        }
        getActivities()
    }, [])

    console.log("LALAL", event)

    if (loading) return <p>Loading...</p>
    if (error) return <p>Failed to load event.</p>
    if (!formEvent) return null

    const handleChangeSelectOrInputOrText = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormEvent(prev => {
            if (!prev) return prev
            return { ...prev, [name]: value }
        })
    }

    const handleDiscard = async () => {
        setFormEvent(event)
    }

    return (
        <form>
            <fieldset>
                <div>
                    <div>
                        <label>
                            Activity <span className="text-rose-600">*</span>
                        </label>
                        <select name="activityId" value={formEvent.activityId} onChange={handleChangeSelectOrInputOrText}>
                            <option>Select an Activity</option>
                            {activities?.map((activity) => (
                                <option key={activity.id} value={activity.id}>
                                    {activity.name}
                                </option>
                            ))}
                        </select>
                        {/* {errors.activity && <p className="text-sm text-red-600 mt-1">{errors.activity}</p>} */}
                    </div>

                    <div>
                        <label>
                            Name <span className="text-rose-600">*</span>
                        </label>
                        <input
                            name='name'
                            placeholder='Name'
                            value={formEvent.name}
                            onChange={handleChangeSelectOrInputOrText}
                        />
                        {/* {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>} */}
                    </div>
                    <div>
                        <label>
                            Description <span className="text-rose-600">*</span>
                        </label>
                        <input
                            name='description'
                            placeholder='Description'
                            value={formEvent.description}
                            onChange={handleChangeSelectOrInputOrText}
                            maxLength={750}
                        />
                        {/* {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>} */}
                    </div>
                    <div>
                        <label>
                            Date <span className="text-rose-600">*</span>
                        </label>
                        <input
                            name='date'
                            placeholder='MM/DD/YYYY'
                            value={formEvent.date}
                            onChange={handleChangeSelectOrInputOrText}
                        />
                        {/* {errors.date && <p className="text-sm text-red-600 mt-1">{errors.date}</p>} */}
                    </div>
                    <div>
                        <label>
                            Start Time <span className="text-rose-600">*</span>
                        </label>
                        <input
                            name='startTime'
                            placeholder='Start Time'
                            value={formEvent.startTime}
                            onChange={handleChangeSelectOrInputOrText}
                        />
                        {/* {errors.startTime && <p className="text-sm text-red-600 mt-1">{errors.startTime}</p>} */}
                    </div>
                    <div>
                        <label>
                            End Time <span className="text-rose-600">*</span>
                        </label>
                        <input
                            name='endTime'
                            placeholder='End Time'
                            value={formEvent.endTime}
                            onChange={handleChangeSelectOrInputOrText}
                        />
                        {/* {errors.endTime && <p className="text-sm text-red-600 mt-1">{errors.endTime}</p>} */}
                    </div>
                    <div>
                        <label>
                            Image <span className="text-rose-600">*</span>
                        </label>
                        <input
                            name='image'
                            placeholder='Image (optional)'
                            value={formEvent.image}
                            onChange={handleChangeSelectOrInputOrText}
                        />
                        {/* {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>} */}
                    </div>
                    <div>
                        <label>
                            Participants Limit <span className="text-rose-600">*</span>
                        </label>
                        <input
                            name='limit'
                            placeholder='(e.g. 15)'
                            value={formEvent.limit}
                            onChange={handleChangeSelectOrInputOrText}
                        />
                        {/* {errors.limit && <p className="text-sm text-red-600 mt-1">{errors.limit}</p>} */}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            City <span className="text-rose-600">*</span>
                        </label>
                        <select
                            id='City'
                            name='City'
                            onChange={(e) => setFormEvent({ ...formEvent, city: e.target.value })}
                        >
                            {CITIES_CO.map((city) => {
                                return <option key={city} value={city}>
                                    {city}
                                </option>
                            })}
                        </select>
                    </div>
                    <div>
                        <label>
                            States <span className="ml-1 text-xs text-gray-500">(Select One)</span>
                        </label>
                        < select
                            id='State'
                            name="State"
                            onChange={(e) => setFormEvent({ ...formEvent, state: e.target.value })}
                        >
                            {US_States.map((state) => {
                                return <option key={state} value={state}>
                                    {state}
                                </option>
                            })}
                        </select>
                    </div>
                    <div>
                        <label>
                            Address <span className="text-rose-600">*</span>
                        </label>
                        <input
                            name='address'
                            placeholder='Address'
                            value={formEvent.address}
                            onChange={handleChangeSelectOrInputOrText}
                        />
                        {/* {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>} */}
                    </div>
                    <div>
                        <label>
                            Zipcode <span className="text-rose-600">*</span>
                        </label>
                        <input
                            name='zipCode'
                            placeholder='Zipcode'
                            value={formEvent.zipCode}
                            onChange={handleChangeSelectOrInputOrText}
                            required
                        />
                        {/* {errors.zipCode && <p className="text-sm text-red-600 mt-1">{errors.zipCode}</p>} */}
                    </div>
                    <div>
                        <label>
                            Latititude <span className="text-rose-600">*</span>
                        </label>
                        <input
                            name='latitude'
                            placeholder='Latitude'
                            value={formEvent.latitude}
                            onChange={handleChangeSelectOrInputOrText}
                            required
                        />
                        {/* {errors.latitude && <p className="text-sm text-red-600 mt-1">{errors.latitude}</p>} */}
                    </div>
                    <div>
                        <label>
                            Longitude <span className="text-rose-600">*</span>
                        </label>
                        <input
                            name='longitude'
                            placeholder='Longitude'
                            value={formEvent.longitude}
                            onChange={handleChangeSelectOrInputOrText}
                            required
                        />
                        {/* {errors.longitude && <p className="text-sm text-red-600 mt-1">{errors.longitude}</p>} */}
                    </div>
                </div>
            </fieldset>
            <div className='flex flex-row'>
                <button type='submit' className='border'>
                    Edit Event
                </button>
                <button type='reset' className='border' onClick={handleDiscard}>
                    Cancel
                </button>
            </div>
        </form>
    )
}