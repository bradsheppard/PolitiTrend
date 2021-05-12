function toDate(dateTime: string): string {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    const date = new Date(dateTime)
    return date.toLocaleDateString('en-US', options)
}

export { toDate }
