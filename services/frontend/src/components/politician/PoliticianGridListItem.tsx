import * as React from 'react';
import { Box, createStyles, Theme, Typography } from '@material-ui/core';
import { politicianNameToImagePath } from '../../utils/ImagePath';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import Fade from '../common/Fade';

interface IProps {
    politician: Politician;
}

interface Politician {
    id: number;
    name: string;
    party: string;
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
            marginRight: theme.spacing(4),
            position: 'relative',
            float: 'left',
            overflow: 'hidden',
            height: theme.spacing(30),
            width: theme.spacing(30)
        },
        textContainer: {
            float: 'left'
        },
        container: {
            clear: 'both',
            overflow: 'auto'
        }
    })
);

const PoliticianGridListItem = (props: IProps & React.HTMLAttributes<HTMLDivElement>) => {
    const classes = useStyles();

    return (
        <Fade>
            <div className={clsx(classes.container, props.className)}>
                <div className={classes.imageContainer}>
                    <img src={politicianNameToImagePath(props.politician.name)} alt={props.politician.name} className={classes.image} />
                </div>
                <div className={classes.textContainer}>
                    <Typography variant='h4' color='textPrimary'>
                        <Box fontWeight='fontWeightBold'>
                            {props.politician.name}
                        </Box>
                    </Typography>
                    <Typography variant='h6' color='textSecondary'>
                        {props.politician.party}
                    </Typography>
                    <Typography variant='h6' color='textSecondary'>
                        Senator
                    </Typography>
                </div>
            </div>
        </Fade>
    );
};

export default PoliticianGridListItem;