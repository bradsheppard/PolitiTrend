import * as React from 'react';
import { Card, CardContent, createStyles, Theme, Typography, WithStyles, withStyles } from '@material-ui/core';

interface IProps extends WithStyles<typeof style> {
	header: string;
	body: string;
	className?: string;
}

const style = (theme: Theme) => createStyles({
	typography: {
		margin: theme.spacing(2)
	}
});

const HeadlineCard = (props: IProps) => {
	return (
		<Card className={props.className} raised={true}>
			<CardContent>
				<Typography variant='h5' align='center' className={props.classes.typography}>
					{props.header}
				</Typography>
				<Typography variant='body2' align='center'>
					{props.body}
				</Typography>
			</CardContent>
		</Card>
	)
};

export default withStyles(style)(HeadlineCard);
