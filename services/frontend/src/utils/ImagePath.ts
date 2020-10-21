const politicianNameToImagePath = (name: string): string => {
    return `http://politician/images/${name.replace(/ /g, '_')}.jpg`
}

export { politicianNameToImagePath }
