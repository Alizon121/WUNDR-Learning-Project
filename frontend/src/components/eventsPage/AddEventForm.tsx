'use client'

import { useEffect, useRef, useState } from 'react';
import { makeApiRequest } from '../../../utils/api';
import { isLoggedIn } from '../../../utils/auth';
import { CITIES_CO } from '@/data/citiesCO';
import { US_States } from '@/data/states';
import { Event } from '@/types/event';
import { Activity } from '@/types/activity';
import MultiSelect from '../common/MultiSelect';
import next from 'next';
import e from 'express';

type ActivitiesResponse = { activities: Activity[] }
type FormErrors = Partial<Record<"activity" | "name" | "description" | "date" | "startTime" | "endTime" | "partiicpants", string>>
const initialEventForm: Event = {
    activityId: [],
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
    zipCode: "",
    latitude: 0,
    longitude: 0,
    userId: [],
    childIDs: []
}
export default function EventForm() {
    const [event, setEvent] = useState<Event>(initialEventForm)
    const [errors, setErrors] = useState<FormErrors>({})
    const [activities, setActivities] = useState<Activity[]>([])
    const [selectedActivity, setSelectedActivity] = useState<string>("")

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

    console.log(selectedActivity)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({})

        // Add validations here


    }

    return (
        <div>
            <h1>Add an Event Below</h1>
            <form>
                <fieldset>
                    <div>
                        <div>
                            <label>
                                Activity <span className="text-rose-600">*</span>
                            </label>
                            <select value={selectedActivity} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedActivity(e.target.value)}>
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
                                required
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
                                required
                            />
                            {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
                        </div>

                        <div>
                            <label>
                                Date <span className="text-rose-600">*</span>
                            </label>
                            <input
                                name='date'
                                placeholder='Date'
                                value={event.date}
                                onChange={handleChangeSelectOrInputOrText}
                                required
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
                                required
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
                                required
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
                                required
                            />
                            {/* {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>} */}
                        </div>


                        {/* There will be no participants when enrolling */}
                        {/* <div>
                            <label>
                                Participants <span className="text-rose-600">*</span>
                            </label>
                            <input
                                name='participants'
                                placeholder='Participants Actively Enrolled (e.g. 5)'
                                value={event.name}
                                onChange={handleChangeSelectOrInputOrText}
                                required
                            />
                            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                        </div> */}

                        <div>
                            <label>
                                Participants Limit <span className="text-rose-600">*</span>
                            </label>
                            <input
                                name='limit'
                                placeholder='Limit of Participants (e.g. 15)'
                                value={event.name}
                                onChange={handleChangeSelectOrInputOrText}
                                required
                            />
                            {errors.partiicpants && <p className="text-sm text-red-600 mt-1">{errors.partiicpants}</p>}
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
                                    return <option key={state} value={event.state}>
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
                                required
                            />
                            {/* {errors.partiicpants && <p className="text-sm text-red-600 mt-1">{errors.partiicpants}</p>} */}
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
                            {/* {errors.partiicpants && <p className="text-sm text-red-600 mt-1">{errors.partiicpants}</p>} */}
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
                            {/* {errors.partiicpants && <p className="text-sm text-red-600 mt-1">{errors.partiicpants}</p>} */}
                        </div>


                    </div>
                </fieldset>
                <div className='flex flex-row'>
                    <button type='submit' className='border'>
                        Add Event
                    </button>
                    <button type='reset' className='border'>
                        Cancel
                    </button>
                </div>
            </form>
        </div >
    )
}