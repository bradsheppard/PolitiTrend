const politicianNameToImagePath = (name: string) => {
    return `/${name.replace(/ /g, '_')}.jpg`;
};

export { politicianNameToImagePath }