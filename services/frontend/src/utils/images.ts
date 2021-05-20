import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

const politicianNameToImagePath = (name: string): string => {
    return `http://${publicRuntimeConfig.imageUrl}/${name.replace(/ /g, '_')}.jpg`
}

export { politicianNameToImagePath }
