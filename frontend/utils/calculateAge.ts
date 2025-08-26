export const calculateAge = (birthdayDate: string) => {
    const d = new Date(birthdayDate)
    let age = new Date().getFullYear() - d.getFullYear()
    const m = new Date().getMonth() - d.getMonth()

    if (m < 0 || (m === 0 && new Date().getDate() - d.getDate())) age --
    return age
}
