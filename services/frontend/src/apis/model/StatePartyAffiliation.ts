interface StatePartyAffiliation {
    state: string
    affiliations: {
        democratic: number
        republican: number
    }
    sampleSize: number
}

export default StatePartyAffiliation
