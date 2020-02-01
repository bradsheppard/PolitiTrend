import { createStyles, Theme, Typography, withStyles, WithStyles } from '@material-ui/core';
import { default as React, PropsWithChildren } from 'react';

const style = (theme: Theme) => createStyles({
	typography: {
		margin: theme.spacing(4)
	}
});

interface IProps extends WithStyles<typeof style>, PropsWithChildren<{}> {}

const Paragraph = (props: IProps) => {
	return (
		<Typography variant='body1' color='secondary' className={props.classes.typography} align='center'>
			{props.children}
		</Typography>
	)
};

export default withStyles(style)(Paragraph);
