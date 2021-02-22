import * as React from 'react'
import { createStyles, Theme, Typography } from '@material-ui/core'
import { politicianNameToImagePath } from '../../utils/ImagePath'
import { makeStyles } from '@material-ui/styles'
import clsx from 'clsx'
import Image from 'next/image'

interface IProps {
    politician: Politician
}

interface Politician {
    id: number
    name: string
    party: string
    role: string
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        image: {
            position: 'absolute',
            margin: 'auto',
            width: '100%',
            top: '-80%',
            bottom: '-100%',
            left: '-100%',
            right: '-100%',
        },
        imageContainer: {
            marginRight: theme.spacing(2),
            position: 'relative',
            float: 'left',
            overflow: 'hidden',
            borderRadius: '50%',
            height: theme.spacing(40),
            width: theme.spacing(40),
        },
        textContainer: {
            float: 'left',
        },
        container: {
            display: 'flex',
        },
    })
)

const PoliticiansGridListItem: React.FC<IProps & React.HTMLAttributes<HTMLDivElement>> = (
    props: IProps & React.HTMLAttributes<HTMLDivElement>
) => {
    const classes = useStyles()

    return (
        <div className={clsx(classes.container, props.className)}>
            <div className={classes.imageContainer}>
                <Image
                    src={politicianNameToImagePath(props.politician.name)}
                    alt={props.politician.name}
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            <div className={classes.textContainer}>
                <Typography variant="h4" color="textPrimary">
                    {props.politician.name}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    {props.politician.party}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    {props.politician.role}
                </Typography>
            </div>
        </div>
    )
}

export default PoliticiansGridListItem
