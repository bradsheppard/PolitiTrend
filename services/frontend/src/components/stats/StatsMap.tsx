import * as React from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

import allStates from './allstates.json'
import { scaleQuantize } from 'd3-scale'
import { useState } from 'react'
import ReactTooltip from 'react-tooltip'
import Globals from '../../utils/Globals'
import tinygradient from 'tinygradient'

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'
const gray = '#c4c4c4'

const blueGradient = tinygradient(Globals.blue, gray)
const redGradient = tinygradient(Globals.red, gray)

const republicanScale = scaleQuantize<string>()
    .domain([0, 0.05])
    .range([
        redGradient.rgbAt(0.8).toHexString(),
        redGradient.rgbAt(0.6).toHexString(),
        redGradient.rgbAt(0.4).toHexString(),
        redGradient.rgbAt(0.2).toHexString(),
        redGradient.rgbAt(0).toHexString(),
    ])

const democraticScale = scaleQuantize<string>()
    .domain([0, 0.05])
    .range([
        blueGradient.rgbAt(0.8).toHexString(),
        blueGradient.rgbAt(0.6).toHexString(),
        blueGradient.rgbAt(0.4).toHexString(),
        blueGradient.rgbAt(0.2).toHexString(),
        blueGradient.rgbAt(0).toHexString(),
    ])

interface Props {
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

const StatsMap: React.FC<Props & React.HTMLAttributes<HTMLDivElement>> = (
    props: Props & React.HTMLAttributes<HTMLDivElement>
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

                            let color = '#c4c4c4'
                            let party = 'Neutral'

                            if (statePartyAffiliation) {
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
