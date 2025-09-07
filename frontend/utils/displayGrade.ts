export const displayGrade = (g: number | null | undefined) => {
    if (g === null || g === undefined) return "N/A"
    if (g === -1) return "Pre-K"
    if (g === 0)  return "Kindergarten"
    return `${g}`
}

export const gradeOptions = [
    { value: -1, label: "Pre-K" },
    { value: 0,  label: "Kindergarten" },
    ...Array.from({ length: 12 }, (_, i) => {
        const g = i + 1;
        return { value: g, label: g };
    }),
]
