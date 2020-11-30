import * as React from 'react'
import { useEffect, useState } from 'react'
import {
    Box,
    Checkbox,
    createStyles,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Theme,
    withStyles,
} from '@material-ui/core'
import { ResponsiveLine as NivoLine } from '@nivo/line'
import SentimentApi from '../../apis/sentiment/SentimentApi'
import { makeStyles } from '@material-ui/styles'

interface IProps {
    politicians: Politician[]
}

interface Point {
    x: string
    y: number
}

interface Line {
    id: string
    data: Point[]
}

interface Politician {
    id: number
    name: string
    party: string
    sentiment?: number
}

interface Row {
    id: number
    name: string
    party: string
    sentiment?: number
    display: boolean
    line?: Line
}

const StyledTableRow = withStyles((theme: Theme) =>
    createStyles({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.action.hover,
            },
        },
    })
)(TableRow)

const StyledTableCell = withStyles((theme: Theme) =>
    createStyles({
        head: {
            backgroundColor: theme.palette.secondary.dark,
            color: theme.palette.common.white,
            fontWeight: 'bold',
            fontSize: 14,
        },
        body: {
            fontSize: 14,
            height: theme.spacing(1),
            paddingTop: 0,
            paddingBottom: 0,
        },
    })
)(TableCell)

type Order = 'asc' | 'desc'

const useStyles = makeStyles({
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
})

interface EnhancedTableProps {
    classes: ReturnType<typeof useStyles>
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Row) => void
    order: Order
    orderBy: string
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (!a[orderBy] && b[orderBy]) {
        return 1
    }
    if (a[orderBy] && !b[orderBy]) {
        return -1
    }
    if (b[orderBy] < a[orderBy]) {
        return -1
    }
    if (b[orderBy] > a[orderBy]) {
        return 1
    }
    return 0
}

function getComparator<T>(order: Order, orderBy: keyof T): (a: T, b: T) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0])
        if (order !== 0) return order
        return a[1] - b[1]
    })
    return stabilizedThis.map((el) => el[0])
}

interface HeadCell {
    disablePadding: boolean
    id: keyof Row
    label: string
}

const headCells: HeadCell[] = [
    { id: 'id', disablePadding: false, label: 'ID' },
    { id: 'name', disablePadding: false, label: 'Politician' },
    { id: 'party', disablePadding: false, label: 'Party' },
    { id: 'sentiment', disablePadding: false, label: 'Current Sentiment' },
    { id: 'display', disablePadding: false, label: 'Display' },
]

function EnhancedTableHead(props: EnhancedTableProps) {
    const { classes, order, orderBy, onRequestSort } = props
    const createSortHandler = (property: keyof Row) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property)
    }

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align="left"
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}

const StatsSentimentTable: React.FC<IProps> = (
    props: IProps & React.HTMLAttributes<HTMLDivElement>
) => {
    const classes = useStyles()
    const [page, setPage] = useState(0)
    const [order, setOrder] = useState<Order>('desc')
    const [orderBy, setOrderBy] = useState<keyof Row>('display')

    const initialRows: Row[] = props.politicians.map((politician) => {
        const row: Row = {
            id: politician.id,
            display: politician.id === 101 || politician.id === 102,
            name: politician.name,
            sentiment:
                politician.sentiment !== undefined ? scaleSentiment(politician.sentiment) : 0,
            party: politician.party,
        }

        return row
    })

    useEffect(() => {
        ;(async () => {
            await updateLines()
        })()
    }, [])

    const [rows, setRows] = useState<Row[]>(initialRows)

    const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof Row) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleCheckboxClicked = async (index: number) => {
        const newRows = rows.slice(0)

        for (const row of newRows) {
            if (row.id === index) {
                row.display = !row.display
            }
        }

        await updateLines()
    }

    const updateLines = async () => {
        const newRows = rows.slice(0)

        for (const row of newRows) {
            if (!row.line && row.display) {
                row.line = await addLine(row)
            }
        }

        setRows(newRows)
    }

    const scaleSentiment = (sentiment: number) => {
        return parseFloat((sentiment * 5 + 5).toFixed(1))
    }

    const addLine = async (row: Row) => {
        const politicianSentiments = await SentimentApi.getHistoryForPolitician(row.id)
        const data = politicianSentiments.map((sentiment) => {
            const date = new Date(sentiment.dateTime)
            return {
                x: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
                y: scaleSentiment(sentiment.sentiment),
            }
        })
        const line: Line = {
            id: row.name,
            data: data,
        }
        return line
    }

    const numRows = 6

    return (
        <Grid container>
            <Grid item xs={12}>
                <Box height={400}>
                    <NivoLine
                        data={rows.filter((x) => x.line && x.display).map((x) => x.line as Line)}
                        margin={{ top: 50, right: 200, bottom: 50, left: 60 }}
                        xScale={{
                            type: 'time',
                            format: '%Y-%m-%d',
                            useUTC: false,
                            precision: 'day',
                        }}
                        legends={[
                            {
                                anchor: 'bottom-right',
                                direction: 'column',
                                justify: false,
                                translateX: 180,
                                translateY: 0,
                                itemsSpacing: 0,
                                itemDirection: 'left-to-right',
                                itemWidth: 160,
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
                                            itemOpacity: 1,
                                        },
                                    },
                                ],
                            },
                        ]}
                        xFormat="time:%Y-%m-%d"
                        yScale={{ type: 'linear', min: 1, max: 10, stacked: false, reverse: false }}
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                            format: '%b %d',
                            tickValues: 'every 2 days',
                            legend: 'time scale',
                            legendOffset: -12,
                        }}
                        axisLeft={{
                            orient: 'left',
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'Sentiment',
                            legendOffset: -40,
                            legendPosition: 'middle',
                        }}
                        colors={{ scheme: 'dark2' }}
                        pointSize={8}
                        pointColor={{ theme: 'background' }}
                        pointBorderWidth={3}
                        pointBorderColor={{ from: 'serieColor' }}
                        pointLabel="sentiment"
                        pointLabelYOffset={-12}
                        lineWidth={3}
                        useMesh={true}
                    />
                </Box>
            </Grid>
            <Grid item xs={12}>
                <div>
                    <TableContainer>
                        <Table size="small">
                            <EnhancedTableHead
                                classes={classes}
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                            />
                            <TableBody>
                                {stableSort<Row>(rows, getComparator<Row>(order, orderBy))
                                    .slice(page * numRows, page * numRows + numRows)
                                    .map((row: Row, index: number) => (
                                        <StyledTableRow key={index}>
                                            <StyledTableCell>{row.id}</StyledTableCell>
                                            <StyledTableCell>{row.name}</StyledTableCell>
                                            <StyledTableCell>{row.party}</StyledTableCell>
                                            <StyledTableCell>
                                                {row.sentiment
                                                    ? scaleSentiment(row.sentiment)
                                                    : 'N/A'}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Checkbox
                                                    size="small"
                                                    checked={row.display}
                                                    onChange={async () =>
                                                        await handleCheckboxClicked(row.id)
                                                    }
                                                />
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
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
        </Grid>
    )
}

export default StatsSentimentTable
