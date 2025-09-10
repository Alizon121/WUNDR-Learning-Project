export type Event = {
    id: string
    activityId: string
    name: string
    description: string
    date: string
    image: string
    participants: number
    limit: number

    city: string
    state: string
    address: string
    zipCode: string
    latitude: number
    longitude: number

    userId: string[]
    childIds: string[]
}
