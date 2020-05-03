const politicianNameToImagePath = (name: string) => {
    return `http://politician/images/${name.replace(/ /g, '_')}.jpg`;
};

export { politicianNameToImagePath }
