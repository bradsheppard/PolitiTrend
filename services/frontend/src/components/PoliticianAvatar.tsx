import * as React from 'react';
import { politicianNameToImagePath } from '../utils/ImagePath';
import { Typography } from '@material-ui/core';

interface Politician {
	name: string;
	party: string;
	sentiment: number;
}

interface IProps {
	politician: Politician;
}

const PoliticianAvatar = (props: IProps) => {
	const { politician } = props;

	return (
		<React.Fragment>
			<img src={politicianNameToImagePath(politician.name)} alt={politician.name} />
			<Typography variant='h4' color='primary'>
				{politician.name}
				</Typography>
				<Typography variant='h5' color='primary'>
				{politician.party}
				</Typography>
				<Typography variant='subtitle1' color='primary'>
				Score: {politician.sentiment.toFixed(1)}
			</Typography>
		</React.Fragment>
	)
};

export default PoliticianAvatar;
