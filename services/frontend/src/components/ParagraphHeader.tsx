import { createStyles, Theme, Typography, withStyles, WithStyles } from '@material-ui/core';
import { PropsWithChildren, default as React } from 'react';

const style = (theme: Theme) => createStyles({
	typography: {
		margin: theme.spacing(4)
	}
});

interface IProps extends WithStyles<typeof style>, PropsWithChildren<{}> {}

const ParagraphHeader = (props: IProps) => {
	return (
		<Typography variant='h2' color='secondary' className={props.classes.typography} align='center'>
			{props.children}
		</Typography>
	);
};

export default withStyles(style)(ParagraphHeader);
