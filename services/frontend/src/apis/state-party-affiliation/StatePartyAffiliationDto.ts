interface StatePartyAffiliationDto {
    state: string;
    affiliations: {
        democratic: string;
        republican: string;
    }
}

export default StatePartyAffiliationDto;
