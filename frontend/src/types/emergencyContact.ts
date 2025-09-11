import { onlyDigitals } from "../../utils/formatPhoneNumber"

export type EmergencyContact = {
    id: string
    firstName: string
    lastName: string
    phoneNumber: string
    relationship: string
}

export type ECInput = Pick<EmergencyContact, "firstName" | "lastName" | "phoneNumber" | "relationship">
export type ECErrors = Partial<{
    firstName: string
    lastName: string
    relationship: string
    phoneNumber: string
}>

const normalizeEC = (c: ECInput) => ({
    firstName: (c.firstName || "").trim().toLowerCase(),
    lastName: (c.lastName || "").trim().toLowerCase(),
    relationship: (c.relationship || "").trim().toLowerCase(),
    phoneNumber: onlyDigitals(c.phoneNumber || "")
})

export const dedupeECs = (arr: ECInput[]) => {
    const seen = new Set<string>()
    const out: ECInput[] = []

    for (const contact of arr) {
        const key = JSON.stringify(normalizeEC(contact))

        if (!seen.has(key)) {
            seen.add(key)
            out.push(contact)
        }
    }

    return out.slice(0, 3);
}

export const ecsEqual = (a: ECInput[], b: ECInput[]) => {
    const toKeySet = (xs: ECInput[]) => new Set(xs.map(x => JSON.stringify(normalizeEC(x))))

    const A = toKeySet(a)
    const B = toKeySet(b)

    if (A.size !== B.size) return false
    for (const k of A) if (!B.has(k)) return false

    return true
}
