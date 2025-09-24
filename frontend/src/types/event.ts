export type Event = {
    id?: string
    activityId: string
    name: string
    description: string
    date: string
    startTime: string
    endTime: string
    image: string
    participants?: number
    limit: number

    city: string
    state: string
    address: string
    zipCode: string
    latitude: number | null
    longitude: number | null

    userId: string[]
    childIDs: string[]
}
