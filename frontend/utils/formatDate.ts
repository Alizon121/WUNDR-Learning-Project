export const numericFormatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        month: "numeric",
        day: "numeric",
        year: "numeric"
    })
}

export const formatNotificationTime = (timeString: string): string => {
    const date = new Date(timeString);

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${month}-${day}-${year} ${hours}:${minutes}`;
  };

  export function formatWhen(iso: string) {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    const timeHHMM = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (diffDays === 0) return `Today ${timeHHMM}`;
    if (diffDays === 1) return `Yesterday ${timeHHMM}`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString();
  }

export const formatDate = (dateString: string) => {
    const date = new Date(dateString)

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

export const combineLocal = (isoOrDateOnly: string, timeStr = "09:00") => {
    if (!isoOrDateOnly) return new Date(NaN);

    // Extract just the date part
    const m = isoOrDateOnly.match(/^\d{4}-\d{2}-\d{2}/);
    if (!m) return new Date(NaN);

    const [y, mm, d] = m[0].split("-").map(Number)
    const [hh = 0, min = 0] = timeStr.split(":").map(Number)

    return new Date(y, mm - 1, d, hh, min, 0, 0)
}

export const convertStringToIsoFormat = (date: string) => {
    let newDate: Date = new Date(date)
    return newDate.toISOString()
}