import * as React from 'react';
import { Tab, Tabs } from '@material-ui/core';
import Card from '../common/Card';
import PoliticianTweetFeed from './PoliticianTweetFeed';
import PoliticianNewsArticleFeed from './PoliticianNewsArticleFeed';

interface IProps {
    politician: number;
}

const PoliticianFeed = (props: IProps) => {
    const [tabValue, setTabValue] = React.useState(0);

    const { politician } = props;

    const handleTabChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <Card>
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
