const scaleSentiment = (sentiment: number): number => {
    return parseFloat((sentiment * 5 + 5).toFixed(1))
}

export { scaleSentiment }
