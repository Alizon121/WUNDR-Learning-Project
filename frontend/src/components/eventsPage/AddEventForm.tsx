'use client'

import { useEffect, useRef, useState } from 'react';
import { makeApiRequest } from '../../../utils/api';
import { CITIES_CO } from '@/data/citiesCO';
import { US_States } from '@/data/states';
import { Event } from '@/types/event';
import { Activity } from '@/types/activity';
import { EventPayload } from '../../../utils/auth';
import e from 'express';

type EventsResponse = { events: Event[] }
type ActivitiesResponse = { activities: Activity[] }
type FormErrors = Partial<Record<"activity" | "name" | "description" | "date" | "startTime" | "endTime" | "limit" | "address" | "longitude" | "latitude" | "zipCode", string>>
const initialEventForm: Event = {
    activityId: "",
    name: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    image: "",
    participants: 0,
    limit: 0,
    city: "",
    state: "",
    address: "",
    zipCode: 12345,
    latitude: 0,
    longitude: 0,
    userId: [],
    childIDs: []
}
export default function EventForm() {
    const [event, setEvent] = useState<Event>(initialEventForm)
    const [errors, setErrors] = useState<FormErrors>({})
    const [activities, setActivities] = useState<Activity[]>([])
    const [fetchedEvents, setFetchedEvents] = useState<Event[]>([])
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    // useEffect hooks for fetching Events and Activities
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

    const handleChangeSelectOrInputOrText = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setEvent(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleDiscard = async () => {
        setEvent(initialEventForm)
    }

    const convertStringToIsoFormat = (date: string) => {
        let newDate: Date = new Date(date)
        return newDate.toISOString()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({})
        const newErrors: FormErrors = {}

        // * Add validations here
        // Ensure the name does not already exist
        const matchingNames = fetchedEvents.find((e) => e.name === event.name)
        if (matchingNames) {
            newErrors.name = "Name Already Exists"
        }

        // Validate name's length:
        if (event.name.length < 1) newErrors.name = "Name must be greater than one character"

        // Validate description length:
        if (event.description.length < 1) newErrors.description = "Description must be greater than one character"

        // Validate date format:
        if (!dateRegex.test(event.date)) newErrors.date = "Please provide MM/DD/YYYY format"

        // Validate time formats:
        if (!timeRegex.test(event.startTime)) newErrors.startTime = "Please provide hh:mm format"

        if (!timeRegex.test(event.endTime)) newErrors.endTime = "Please provide hh:mm format"

        // Validate participant LIMIT:
        if (event.limit > 100) newErrors.limit = "There must be less than 100 participants"
        if (event.limit < 0) newErrors.limit = "There must be at least 0 participants"

        // Validate the address:
        //  ! Add more robust validation
        if (event.address.length < 5) newErrors.address = "Please enter an address greater than 5 characters"
        if (event.address.length > 200) newErrors.address = "Address must contain less than 200 characters"
        if (event.zipCode.toString().length < 5) newErrors.zipCode = "Please provide a valid zipcode"
        // Validate lattitude/longitude
        if (event.latitude < -90 || event.latitude > 90) newErrors.latitude = "Please provide valid latitude"
        if (event.longitude < -180 || event.longitude > 180) newErrors.longitude = "Please provide valid longitude"

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        // Create Payload
        const payload: EventPayload = {
            activityId: event.activityId,
            name: event.name,
            description: event.description,
            date: convertStringToIsoFormat(event.date),
            startTime: event.startTime,
            endTime: event.endTime,
            image: event.image,
            participants: event.participants,
            limit: Number(event.limit),
            city: event.city,
            state: event.state,
            address: event.address,
            zipCode: parseInt(event.zipCode.toString(), 10),
            latitude: parseFloat(event.latitude.toString()),
            longitude: parseFloat(event.longitude.toString()),
            userId: [],
            childIDs: []
        }

        // Try to add an event
        try {
            const response: any = await makeApiRequest("http://localhost:8000/event", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: payload
            })

            if (response) {
                console.log("Event successfully created:", response)
                setEvent(initialEventForm)
            } else {
                console.error("Failed to create event")
            }
        } catch (e) {
            throw new Error(`Unable to add event: ${e}`)
        }
    }

    return (
        <div>
            <h1>Add an Event Below</h1>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <div>
                        <div>
                            <label>
                                Activity <span className="text-rose-600">*</span>
                            </label>
                            <select name="activityId" value={event.activityId} onChange={handleChangeSelectOrInputOrText}>
                                <option>Select an Activity</option>
                                {activities.map((activity) => (
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
                                value={event.name}
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
                                value={event.description}
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
                                value={event.date}
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
                                value={event.startTime}
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
                                value={event.endTime}
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
                                value={event.image}
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
                                value={event.limit}
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
                                onChange={(e) => setEvent({ ...event, city: e.target.value })}
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
                                onChange={(e) => setEvent({ ...event, state: e.target.value })}
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
                                value={event.address}
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
                                value={event.zipCode}
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
                                value={event.latitude}
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
                                value={event.longitude}
                                onChange={handleChangeSelectOrInputOrText}
                                required
                            />
                            {errors.longitude && <p className="text-sm text-red-600 mt-1">{errors.longitude}</p>}
                        </div>


                    </div>
                </fieldset>
                <div className='flex flex-row'>
                    <button type='submit' className='border'>
                        Add Event
                    </button>
                    <button type='reset' className='border' onClick={handleDiscard}>
                        Cancel
                    </button>
                </div>
            </form>
        </div >
    )
}