export const numericFormatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        month: "numeric",
        day: "numeric",
        year: "numeric"
    })
}
