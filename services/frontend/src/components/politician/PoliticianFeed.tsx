import * as React from 'react';
import { Tab, Tabs } from '@material-ui/core';
import PoliticianNewsArticleFeed from './PoliticianNewsArticleFeed';
import PoliticianTweetFeed from './PoliticianTweetFeed';

interface IProps {
    politician: number;
}
const PoliticianFeed = (props: IProps) => {
    const [tabValue, setTabValue] = React.useState(0);

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
            <PoliticianNewsArticleFeed politician={politician} hidden={tabValue === 1} />
            <PoliticianTweetFeed politician={politician} hidden={tabValue === 0} />
        </React.Fragment>
    );
};

export default PoliticianFeed;
