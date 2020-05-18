import * as React from 'react';
import {
    createStyles,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow,
    Theme,
    withStyles
} from '@material-ui/core';

interface IProps {
    politicians: Politician[];
}

interface Politician {
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

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    return (
        <div className={props.className}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Rank</StyledTableCell>
                            <StyledTableCell>Politician</StyledTableCell>
                            <StyledTableCell>Party</StyledTableCell>
                            <StyledTableCell>Sentiment</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.politicians.map((politician: Politician, index: number) => (
                            <StyledTableRow key={index}>
                                <StyledTableCell>{index+1}</StyledTableCell>
                                <StyledTableCell>{politician.name}</StyledTableCell>
                                <StyledTableCell>{politician.party}</StyledTableCell>
                                <StyledTableCell>{politician.sentiment}</StyledTableCell>
                            </StyledTableRow>
                        )).slice(page * 10, page * 10 + 10)}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={props.politicians.length}
                rowsPerPageOptions={[10]}
                rowsPerPage={10}
                page={page}
                onChangePage={handleChangePage}
            />
        </div>
    );
};

export default StatsSentimentTable;
