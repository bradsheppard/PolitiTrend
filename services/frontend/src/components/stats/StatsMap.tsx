import * as React from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

import allStates from './allstates.json'
import { scaleQuantize } from 'd3-scale'
import { useState } from 'react'
import ReactTooltip from 'react-tooltip'

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'

const republicanScale = scaleQuantize<string>()
    .domain([0, 0.05])
    .range(['#cc9b98', '#cc7372', '#cc5959', '#cc4542', '#CC2C26'])

const democraticScale = scaleQuantize<string>()
    .domain([0, 0.05])
    .range(['#99aacd', '#8299cd', '#6483cd', '#4e74cd', '#3463cd'])

interface IProps {
    statePartyAffiliations: StatePartyAffiliation[]
}

interface StatePartyAffiliation {
    state: string
    affiliations: {
        republican: number
        democratic: number
    }
    sampleSize: number
}

const MIN_SAMPLE_SIZE = 100

const StatsMap: React.FC<IProps & React.HTMLAttributes<HTMLDivElement>> = (
    props: IProps & React.HTMLAttributes<HTMLDivElement>
) => {
    const [tooltip, setTooltip] = useState('')

    const lookupStatePartyAffiliation = (state: string) => {
        return props.statePartyAffiliations.find(
            (statePartyAffiliation) =>
                state.toLowerCase() === statePartyAffiliation.state.toLowerCase()
        )
    }

    return (
        <div className={props.className}>
            <ComposableMap data-tip="" projection="geoAlbersUsa">
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map((geo) => {
                            const state = allStates.find((s) => s.id === geo.id)
                            if (!state) return
                            const statePartyAffiliation = lookupStatePartyAffiliation(state.abv)
                            if (!statePartyAffiliation) return

                            let color = '#333333'
                            let party = 'Neutral'

                            if (statePartyAffiliation.sampleSize > MIN_SAMPLE_SIZE) {
                                if (
                                    statePartyAffiliation.affiliations.democratic >
                                    statePartyAffiliation.affiliations.republican
                                ) {
                                    party = 'Democratic'
                                    color = democraticScale(
                                        statePartyAffiliation.affiliations.democratic -
                                            statePartyAffiliation.affiliations.republican
                                    )
                                } else if (
                                    statePartyAffiliation.affiliations.democratic <
                                    statePartyAffiliation.affiliations.republican
                                ) {
                                    party = 'Republican'
                                    color = republicanScale(
                                        statePartyAffiliation.affiliations.republican -
                                            statePartyAffiliation.affiliations.democratic
                                    )
                                }
                            }

                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill={color}
                                    onMouseEnter={() => {
                                        setTooltip(state.name + ' - ' + party)
                                    }}
                                    onMouseLeave={() => {
                                        setTooltip('')
                                    }}
                                    stroke="#eaeaec"
                                    style={{
                                        default: {
                                            outline: 'none',
                                        },
                                        hover: {
                                            outline: 'none',
                                        },
                                        pressed: {
                                            outline: 'none',
                                        },
                                    }}
                                />
                            )
                        })
                    }
                </Geographies>
            </ComposableMap>
            <ReactTooltip>{tooltip}</ReactTooltip>
        </div>
    )
}

export default StatsMap
