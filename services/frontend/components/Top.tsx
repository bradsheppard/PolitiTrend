import * as React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Globals from '../utils/Globals';

const Header = () => {

    return (
        <div>
            {/*<AppBar position="fixed" color="default">
                <Toolbar>
                    <Typography variant="h6" color="inherit">
                        polc
                    </Typography>
                </Toolbar>
            </AppBar>*/}
            <AppBar position="static" color="default">
                <Toolbar>
                    <Typography variant="h6" color="inherit">
                        {Globals.name}
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>

    );
};

export default Header;