import * as React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

import allStates from './allstates.json';

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

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
                            const color =
                                statePartyAffiliation.affiliations.democratic > statePartyAffiliation.affiliations.republican ?
                                    '#3463cd' : '#CC2C26';
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
