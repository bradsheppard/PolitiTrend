import * as React from 'react';
import {
    Checkbox,
    createStyles, Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow,
    Theme,
    withStyles
} from '@material-ui/core';
import { Line } from '@nivo/line';
import { useState } from 'react';
import SentimentApi from '../../apis/sentiment/SentimentApi';
import AutoSizer from 'react-virtualized-auto-sizer';

interface IProps {
    politicians: Politician[];
    points: Point[];
}

interface SentimentHistory {
    id: string;
    data: Point[];
}

interface Point {
    x: number;
    y: number;
}

interface Politician {
    id: number;
    name: string;
    party: string;
    sentiment: number;
}

const StyledTableRow = withStyles((theme: Theme) =>
    createStyles({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.action.hover,
            },
        },
    }),
)(TableRow);

const StyledTableCell = withStyles((theme: Theme) =>
    createStyles({
        head: {
            backgroundColor: theme.palette.secondary.dark,
            color: theme.palette.common.white,
            fontWeight: 'bold',
            fontSize: 16
        },
        body: {
            fontSize: 14,
        },
    }),
)(TableCell);

const StatsSentimentTable = (props: IProps & React.HTMLAttributes<HTMLDivElement>) => {
    const [page, setPage] = React.useState(0);
    const [sentimentHistorys, setSentimentHistories] = useState<SentimentHistory[]>([]);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const getHighestPerDay = (sentimentHistory: SentimentHistory) => {
        const highs: {[key: number]: number} = {};

        sentimentHistory.data.forEach(point => {
            if (!highs[point.x] || highs[point.x] < point.y) {
                highs[point.x] = point.y;
            }
        });

        const newSentimentHistory: SentimentHistory = {
            id: sentimentHistory.id,
            data: Object.keys(highs).map(key => {
                return {
                    x: parseInt(key),
                    y: highs[parseInt(key)]
                }
            })
        };

        return newSentimentHistory;
    };

    const handleCheckboxClicked = async (politician: Politician) => {
        const politicianSentiments = await SentimentApi.getForPolitician(politician.id);
        const data = politicianSentiments.map(sentiment => {
            return {
                x: new Date(sentiment.dateTime).getDate(),
                y: sentiment.sentiment
            };
        });
        const sentimentHistory: SentimentHistory = {
            id: politician.name,
            data: data
        };
        const current = sentimentHistorys.slice(0, sentimentHistorys.length);
        current.push(getHighestPerDay(sentimentHistory));
        setSentimentHistories(current);
    };

    const numRows = 8;

    return (
        <Grid container>
            <Grid item xs={6}>
                <div className={props.className}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Rank</StyledTableCell>
                                    <StyledTableCell>Politician</StyledTableCell>
                                    <StyledTableCell>Party</StyledTableCell>
                                    <StyledTableCell>Sentiment</StyledTableCell>
                                    <StyledTableCell>Display</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {props.politicians.map((politician: Politician, index: number) => (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell>{index+1}</StyledTableCell>
                                        <StyledTableCell>{politician.name}</StyledTableCell>
                                        <StyledTableCell>{politician.party}</StyledTableCell>
                                        <StyledTableCell>{politician.sentiment}</StyledTableCell>
                                        <StyledTableCell><Checkbox onChange={() => handleCheckboxClicked(politician)} /></StyledTableCell>
                                    </StyledTableRow>
                                )).slice(page * numRows, page * numRows + numRows)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={props.politicians.length}
                        rowsPerPageOptions={[numRows]}
                        rowsPerPage={numRows}
                        page={page}
                        onChangePage={handleChangePage}
                    />
                </div>
            </Grid>
            <Grid item xs={6}>
                <AutoSizer>
                    {({height, width}) => (
                        <Line
                            height={height}
                            width={width}
                            data={sentimentHistorys}
                            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                            xScale={{ type: 'point' }}
                            yScale={{ type: 'linear', min: -1, max: 1, stacked: false, reverse: false }}
                            axisTop={null}
                            axisRight={null}
                            axisBottom={{
                                orient: 'bottom',
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Date',
                                legendOffset: 36,
                                legendPosition: 'middle'
                            }}
                            axisLeft={{
                                orient: 'left',
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Sentiment',
                                legendOffset: -40,
                                legendPosition: 'middle'
                            }}
                            colors={{ scheme: 'nivo' }}
                            pointSize={12}
                            pointColor={{ theme: 'background' }}
                            pointBorderWidth={5}
                            pointBorderColor={{ from: 'serieColor' }}
                            pointLabel='sentiment'
                            pointLabelYOffset={-12}
                            lineWidth={5}
                            useMesh={true}
                            legends={[
                                {
                                    anchor: 'bottom-right',
                                    direction: 'column',
                                    justify: false,
                                    translateX: 100,
                                    translateY: 0,
                                    itemsSpacing: 0,
                                    itemDirection: 'left-to-right',
                                    itemWidth: 80,
                                    itemHeight: 20,
                                    itemOpacity: 0.75,
                                    symbolSize: 12,
                                    symbolShape: 'circle',
                                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                                    effects: [
                                        {
                                            on: 'hover',
                                            style: {
                                                itemBackground: 'rgba(0, 0, 0, .03)',
                                                itemOpacity: 1
                                            }
                                        }
                                    ]
                                }
                            ]}
                        />
                    )}
                </AutoSizer>
            </Grid>
        </Grid>
    );
};

export default StatsSentimentTable;
