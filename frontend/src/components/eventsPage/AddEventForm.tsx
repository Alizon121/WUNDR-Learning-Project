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


    useEffect(() => {
        // create async helper function to get activities
        const getActivities = async () => {
            try {
                let fetchActivities: Activity[] = await makeApiRequest("http://localhost:8000/activity")
                if (fetchActivities) setActivities(fetchActivities)
            } catch {
                throw Error("Unable to fetch activities")
            }
        }
        getActivities()
    }, [])

    return (
        <div>
            <h1>Add an Event Below</h1>
            <form>
                <fieldset>
                    <div>
                        {/* add select box for activity - iterate and display all activities */}
                        <div>
                            <label>
                                Activity <span className="text-rose-600">*</span>
                            </label>
                            {activities?.map((activity) => {
                                return (
                                    <input
                                        name={activity.name}
                                        type='checkbox'
                                        value={activity.id}
                                        // onChange={null}
                                        required
                                    />
                                )
                            })
                            }
                            {errors.activity && <p className="text-sm text-red-600 mt-1">{errors.activity}</p>}
                        </div>

                        <div>
                            <label>
                                Name <span className="text-rose-600">*</span>
                            </label>
                            <input
                                name='Name'
                                placeholder='Name'
                                value={event.name}
                                // onChange={null}
                                required
                            />
                            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                        </div>


                        <div>
                            <label>
                                Description <span className="text-rose-600">*</span>
                            </label>
                            <input
                                name='Description'
                                placeholder='Description'
                                value={event.description}
                                // onChange={null}
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
                                name='Date'
                                placeholder='Date (e.g. '
                                value={event.date}
                                // onChange={null}
                                required
                            />
                            {errors.date && <p className="text-sm text-red-600 mt-1">{errors.date}</p>}
                        </div>

                        <div>
                            <label>
                                Start Time <span className="text-rose-600">*</span>
                            </label>
                            <input
                                name='Start Time'
                                placeholder='Start Time'
                                value={event.startTime}
                                // onChange={null}
                                required
                            />
                            {errors.startTime && <p className="text-sm text-red-600 mt-1">{errors.startTime}</p>}
                        </div>

                        <div>
                            <label>
                                End Time <span className="text-rose-600">*</span>
                            </label>
                            <input
                                name='End Time'
                                placeholder='End Time'
                                value={event.endTime}
                                // onChange={null}
                                required
                            />
                            {errors.endTime && <p className="text-sm text-red-600 mt-1">{errors.endTime}</p>}
                        </div>

                        <div>
                            <label>
                                Image <span className="text-rose-600">*</span>
                            </label>
                            <input
                                name='Image'
                                placeholder='Image (optional)'
                                value={event.image}
                                // onChange={null}
                                required
                            />
                            {/* {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>} */}
                        </div>

                        {/* <div>
                            <label>
                                Participants <span className="text-rose-600">*</span>
                            </label>
                            <input
                                name='Participants'
                                placeholder='Participants Actively Enrolled (e.g. 5)'
                                value={event.name}
                                // onChange={null}
                                required
                            />
                            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                        </div> */}

                        <div>
                            <label>
                                Participants Limit <span className="text-rose-600">*</span>
                            </label>
                            <input
                                name='Limit'
                                placeholder='Limit of Participants (e.g. 15)'
                                value={event.name}
                                // onChange={null}
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
                                name='Address'
                                placeholder='Address'
                                value={event.address}
                                // onChange={null}
                                required
                            />
                            {/* {errors.partiicpants && <p className="text-sm text-red-600 mt-1">{errors.partiicpants}</p>} */}
                        </div>

                        <div>
                            <label>
                                Zipcode <span className="text-rose-600">*</span>
                            </label>
                            <input
                                name='Zipcode'
                                placeholder='Zipcode'
                                value={event.zipCode}
                                // onChange={null}
                                required
                            />
                        </div>

                        <div>
                            <label>
                                Latititude <span className="text-rose-600">*</span>
                            </label>
                            <input
                                name='Latitude'
                                placeholder='Latitude'
                                value={event.latitude}
                                // onChange={null}
                                required
                            />
                            {/* {errors.partiicpants && <p className="text-sm text-red-600 mt-1">{errors.partiicpants}</p>} */}
                        </div>

                        <div>
                            <label>
                                Longitude <span className="text-rose-600">*</span>
                            </label>
                            <input
                                name='Longitude'
                                placeholder='Longitude'
                                value={event.longitude}
                                // onChange={null}
                                required
                            />
                            {/* {errors.partiicpants && <p className="text-sm text-red-600 mt-1">{errors.partiicpants}</p>} */}
                        </div>


                    </div>
                </fieldset>
            </form>
        </div>
    )
}