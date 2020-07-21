import * as React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

import allStates from './allstates.json';
import { scaleQuantize } from 'd3-scale';

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const republicanScale = scaleQuantize<string>()
    .domain([0, 0.05])
    .range([
        "#cc9b98",
        "#cc7372",
        "#cc5959",
        "#cc4542",
        "#CC2C26"
    ]);

const democraticScale = scaleQuantize<string>()
    .domain([0, 0.05])
    .range([
        "#99aacd",
        "#8299cd",
        "#6483cd",
        "#4e74cd",
        "#3463cd"
    ]);

interface IProps {
    statePartyAffiliations: StatePartyAffiliation[];
}

interface StatePartyAffiliation {
    state: string;
    affiliations: {
        republican: number;
        democratic: number;
    }
}

const StatsMap = (props: IProps) => {

    const lookupStatePartyAffiliation = (state: string) => {
        return props.statePartyAffiliations.find(statePartyAffiliation => state.toLowerCase() === statePartyAffiliation.state.toLowerCase());
    };

    return (
        <ComposableMap projection="geoAlbersUsa">
            <Geographies geography={geoUrl}>
                {({ geographies }) => (
                    <>
                        {geographies.map(geo => {
                            const state = allStates.find(s => s.val === geo.id);
                            if(!state)
                                return;
                            const statePartyAffiliation = lookupStatePartyAffiliation(state.id);
                            if(!statePartyAffiliation)
                                return;

                            let color;
                            if(statePartyAffiliation.affiliations.democratic > statePartyAffiliation.affiliations.republican)
                                color = democraticScale(statePartyAffiliation.affiliations.democratic - statePartyAffiliation.affiliations.republican);
                            else if(statePartyAffiliation.affiliations.democratic < statePartyAffiliation.affiliations.republican)
                                color = republicanScale(statePartyAffiliation.affiliations.republican - statePartyAffiliation.affiliations.democratic);
                            else
                                color = '#33333';

                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill={color}
                                    stroke='#eaeaec'
                                />
                            );
                        })}
                    </>
                )}
            </Geographies>
        </ComposableMap>
    );
};

export default StatsMap;
