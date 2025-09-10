import { Event } from "./event"

export type Activity = {
    id: string
    name: string
    description: string
    events?: Event[]
}
