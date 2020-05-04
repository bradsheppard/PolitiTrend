import * as React from 'react';
import { createStyles, Tab, Tabs, Theme } from '@material-ui/core';
import PoliticianNewsArticleFeed from './PoliticianNewsArticleFeed';
import PoliticianTweetFeed from './PoliticianTweetFeed';
import { makeStyles } from '@material-ui/core/styles';

interface IProps {
    politician: number;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        feedContainer: {
            minHeight: theme.spacing(200)
        }
    })
);

const PoliticianFeed = (props: IProps) => {
    const [tabValue, setTabValue] = React.useState(0);
    const classes = useStyles();

    const { politician } = props;

    const handleTabChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
        setTabValue(newValue);
    };

    function a11yProps(index: any) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    return (
        <React.Fragment>
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                centered
            >
                <Tab label='News Articles' {...a11yProps(0)} />
                <Tab label='Tweets' {...a11yProps(1)} />
            </Tabs>
            <div className={classes.feedContainer}>
                <PoliticianNewsArticleFeed politician={politician} hidden={tabValue === 1} />
                <PoliticianTweetFeed politician={politician} hidden={tabValue === 0} />
            </div>
        </React.Fragment>
    );
};

export default PoliticianFeed;
