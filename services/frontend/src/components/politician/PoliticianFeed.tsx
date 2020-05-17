import * as React from 'react';
import { createStyles, Tab, Tabs, Theme } from '@material-ui/core';
import PoliticianNewsArticleFeed from './PoliticianNewsArticleFeed';
import PoliticianTweetFeed from './PoliticianTweetFeed';
import { makeStyles } from '@material-ui/core/styles';
import PoliticianStatsFeed from './PoliticianStatsFeed';

interface IProps {
    politician: number;
    wordCounts: WordCount[];
}

interface WordCount {
    word: string;
    count: number;
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

    const { politician, wordCounts } = props;

    const handleTabChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
        setTabValue(newValue);
    };

    function a11yProps(index: any) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    function renderFeed(index: number) {
        switch (index) {
            case 0:
                return <PoliticianNewsArticleFeed politician={politician} />;
            case 1:
                return <PoliticianTweetFeed politician={politician}/>;
            case 2:
                return <PoliticianStatsFeed wordCounts={wordCounts}/>;
        }
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
                <Tab label='Stats' {...a11yProps(2)} />
            </Tabs>
            <div className={classes.feedContainer}>
                {renderFeed(tabValue)}
            </div>
        </React.Fragment>
    );
};

export default PoliticianFeed;
