import * as React from 'react';
import { politicianNameToImagePath } from '../utils/ImagePath';
import { Avatar, createStyles, makeStyles, Theme, Typography } from '@material-ui/core';

interface Politician {
	name: string;
	party: string;
	sentiment: number;
}

interface IProps {
	politician: Politician;
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		large: {
			display: 'inline-block',
			width: theme.spacing(40),
			height: theme.spacing(40)
		}
	})
);

const PoliticianAvatar = (props: IProps) => {
	const { politician } = props;
	const classes = useStyles();

	return (
		<React.Fragment>
			<Avatar alt={politician.name} src={politicianNameToImagePath(politician.name)} className={classes.large} />
			<Typography variant='h5' color='primary'>
				{politician.name}
			</Typography>
			<Typography variant='h6' color='primary'>
				{politician.party}
			</Typography>
			<Typography variant='subtitle1' color='primary'>
				Score: {politician.sentiment.toFixed(1)}
			</Typography>
		</React.Fragment>
	)
};

export default PoliticianAvatar;
