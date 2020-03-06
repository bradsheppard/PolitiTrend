import * as React from 'react';
import { Card, Tab, Tabs } from '@material-ui/core';
import PoliticianTweetFeed from './PoliticianTweetFeed';
import PoliticianNewsArticleFeed from './PoliticianNewsArticleFeed';
import { makeStyles } from '@material-ui/styles';

interface IProps {
    politician: number;
}

const useStyles = makeStyles({
    card: {
        background: 'none'
    }
});

const PoliticianFeed = (props: IProps) => {
    const [tabValue, setTabValue] = React.useState(0);

    const { politician } = props;
    const classes = useStyles();

    const handleTabChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <Card elevation={0} className={classes.card}>
            <Tabs
                value={tabValue}
                indicatorColor='primary'
                textColor='primary'
                onChange={handleTabChange}
                centered
            >
                <Tab label='Tweets' />
                <Tab label='News Articles' />
            </Tabs>
            <PoliticianNewsArticleFeed politician={politician} hidden={tabValue === 0} />
            <PoliticianTweetFeed politician={politician} hidden={tabValue === 1} />
        </Card>
    );
};

export default PoliticianFeed;
