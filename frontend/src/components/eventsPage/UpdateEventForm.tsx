"use client"

import { useParams } from "next/navigation"
import { useEvent } from "../../../hooks/useEvent"
import { Event } from "@/types/event"
import { useEffect, useState } from "react"
import { CITIES_CO } from '@/data/citiesCO';
import { US_States } from '@/data/states';
import { Activity } from '@/types/activity';
import { makeApiRequest } from "../../../utils/api"
import { convertStringToIsoFormat } from "../../../utils/formatDate"
import { EventPayload } from '../../../utils/auth';

type ActivitiesResponse = { activities: Activity[] }
type EventsResponse = { events: Event[] }
type FormErrors = Partial<Record<"activity" | "name" | "description" | "date" | "startTime" | "endTime" | "limit" | "address" | "longitude" | "latitude" | "zipCode", string>>

export default function UpdateEventForm() {
    const { eventId } = useParams()
    const { event, loading, error, refetch } = useEvent(eventId)
    const [formEvent, setFormEvent] = useState<Event | null>(null)
    const [activities, setActivities] = useState<Activity[]>()
    const [errors, setErrors] = useState<FormErrors>({})
    const [fetchedEvents, setFetchedEvents] = useState<Event[]>([])
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;


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

    useEffect(() => {
        const getEvents = async () => {
            try {
                let fetchEvents: EventsResponse = await makeApiRequest("http://localhost:8000/event")
                if (fetchEvents) setFetchedEvents(fetchEvents.events)
            } catch (err) {
                throw Error(`Unable to fetch events:", ${err}`)
            }
        }
        getEvents()
    }, [])

    if (loading) return <p>Loading...</p>
    if (error) return <p>Failed to load event.</p>
    if (!formEvent) return <p>Preparing form...</p>

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({})
        const newErrors: FormErrors = {}

        // * Add validations here
        // Ensure the name does not already exist
        const matchingNames = fetchedEvents.find((e) => e.name === formEvent.name)
        if (matchingNames) {
            newErrors.name = "Name Already Exists"
        }

        // Validate name's length:
        if (formEvent.name.length < 1) newErrors.name = "Name must be greater than one character"

        // Validate description length:
        if (formEvent.description.length < 1) newErrors.description = "Description must be greater than one character"

        // Validate date format:
        if (!dateRegex.test(formEvent.date)) newErrors.date = "Please provide MM/DD/YYYY format"

        // Validate time formats:
        if (!timeRegex.test(formEvent.startTime)) newErrors.startTime = "Please provide hh:mm format"

        if (!timeRegex.test(formEvent.endTime)) newErrors.endTime = "Please provide hh:mm format"

        // Validate participant LIMIT:
        if (formEvent.limit > 100) newErrors.limit = "There must be less than 100 participants"
        if (formEvent.limit < 0) newErrors.limit = "There must be at least 0 participants"

        // Validate the address:
        //  ! Add more robust validation
        if (formEvent.address.length < 5) newErrors.address = "Please enter an address greater than 5 characters"
        if (formEvent.address.length > 200) newErrors.address = "Address must contain less than 200 characters"
        if (formEvent.zipCode.toString().length < 5) newErrors.zipCode = "Please provide a valid zipcode"
        // Validate lattitude/longitude
        if (formEvent.latitude < -90 || formEvent.latitude > 90) newErrors.latitude = "Please provide valid latitude"
        if (formEvent.longitude < -180 || formEvent.longitude > 180) newErrors.longitude = "Please provide valid longitude"

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        // Create Payload
        const payload: EventPayload = {
            activityId: formEvent.activityId,
            name: formEvent.name,
            description: formEvent.description,
            date: convertStringToIsoFormat(formEvent.date),
            startTime: formEvent.startTime,
            endTime: formEvent.endTime,
            image: formEvent.image,
            participants: formEvent.participants,
            limit: Number(formEvent.limit),
            city: formEvent.city,
            state: formEvent.state,
            address: formEvent.address,
            zipCode: parseInt(formEvent.zipCode.toString(), 10),
            latitude: parseFloat(formEvent.latitude.toString()),
            longitude: parseFloat(formEvent.longitude.toString()),
            userId: [],
            childIDs: []
        }

        // Try to add an event
        try {
            const response: any = await makeApiRequest(`http://localhost:8000/event/${eventId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: payload
            })

            if (response) {
                console.log("Event successfully created:", response)
                setFormEvent(formEvent)
            } else {
                console.error("Failed to create event")
            }
        } catch (e) {
            throw new Error(`Unable to add event: ${e}`)
        }
    }

    console.log("LALAL", formEvent)

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
        <form onSubmit={handleSubmit}>
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
                        {errors.activity && <p className="text-sm text-red-600 mt-1">{errors.activity}</p>}
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
                        {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
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
                        {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
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
                        {errors.date && <p className="text-sm text-red-600 mt-1">{errors.date}</p>}
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
                        {errors.startTime && <p className="text-sm text-red-600 mt-1">{errors.startTime}</p>}
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
                        {errors.endTime && <p className="text-sm text-red-600 mt-1">{errors.endTime}</p>}
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
                        {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
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
                        {errors.limit && <p className="text-sm text-red-600 mt-1">{errors.limit}</p>}
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
                        {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
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
                        {errors.zipCode && <p className="text-sm text-red-600 mt-1">{errors.zipCode}</p>}
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
                        {errors.latitude && <p className="text-sm text-red-600 mt-1">{errors.latitude}</p>}
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
                        {errors.longitude && <p className="text-sm text-red-600 mt-1">{errors.longitude}</p>}
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