import PropTypes from 'prop-types';
import {Link as RouterLink} from 'react-router-dom';
// @mui
import {Box} from '@mui/material';

// ----------------------------------------------------------------------

Logo.propTypes = {
    disabledLink: PropTypes.bool,
    sx: PropTypes.object,
};

export default function Logo({disabledLink = false, sx}) {
    const logo = (
        <Box sx={{width: 40, height: 40, ...sx}}>
            <img src={`${process.env.PUBLIC_URL}/logo/logo_single.svg`} alt={'A logo which indicates Accounting App'}/>
        </Box>
    );

    if (disabledLink) {
        return <>{logo}</>;
    }

    return <RouterLink to="/">{logo}</RouterLink>;
}
