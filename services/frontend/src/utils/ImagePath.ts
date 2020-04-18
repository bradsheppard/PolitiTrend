const politicianNameToImagePath = (name: string) => {
    return `/images/${name.replace(/ /g, '_')}.jpg`;
};

export { politicianNameToImagePath }
