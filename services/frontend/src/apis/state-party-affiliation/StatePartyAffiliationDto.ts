interface StatePartyAffiliationDto {
    state: string
    affiliations: {
        democratic: number
        republican: number
    }
    sampleSize: number
}

export default StatePartyAffiliationDto
