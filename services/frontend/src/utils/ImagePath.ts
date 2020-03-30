const politicianNameToImagePath = (name: string) => {
    return `/politicians/${name.replace(/ /g, '_')}.jpg`;
};

export { politicianNameToImagePath }
