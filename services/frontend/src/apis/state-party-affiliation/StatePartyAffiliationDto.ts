interface StatePartyAffiliationDto {
    state: string;
    affiliations: {
        democratic: number;
        republican: number;
    }
}

export default StatePartyAffiliationDto;
