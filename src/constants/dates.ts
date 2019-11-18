export const shortDate = (date: Date | string | null) => {
  const opts = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit"
  }
  if(typeof date === "string") {
    return new Date(date).toLocaleDateString("default", opts)
  } else if (date) {
    return date.toLocaleDateString("default", opts)
  } else {
    return date
  }
}