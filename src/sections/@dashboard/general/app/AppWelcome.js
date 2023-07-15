import PropTypes from 'prop-types';
import {useTranslation} from "react-i18next";
// @mui
import { styled } from '@mui/material/styles';
import { Typography, Button, Card, CardContent } from '@mui/material';
import { SeoIllustration } from '../../../../assets';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  backgroundColor: theme.palette.primary.lighter,
  [theme.breakpoints.up('md')]: {
    height: '100%',
    display: 'flex',
    textAlign: 'left',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

// ----------------------------------------------------------------------

AppWelcome.propTypes = {
  displayName: PropTypes.string,
};

// eslint-disable-next-line react/prop-types
export default function AppWelcome({ displayName, isRemove, setTrueIsRemove }) {
    const {t} = useTranslation()

    if (isRemove || localStorage.getItem('appWelcomeRemove') === 'true') {
        localStorage.setItem('appWelcomeRemove', true)
        return <div/>
    }

  return (
    <RootStyle>
      <CardContent
        sx={{
          p: { md: 0 },
          pl: { md: 5 },
          color: 'grey.800',
        }}
      >
        <Typography gutterBottom variant="h4">
            {t('Welcome back')}, {!displayName ? '...' : displayName}!
        </Typography>

        <Typography variant="body2" sx={{ pb: { xs: 3, xl: 4 }, maxWidth: 480, mx: 'auto' }}>
            {t('We hope to make a very sweet experience for you.')}
        </Typography>

        <Button variant="contained" onClick={setTrueIsRemove}>
          Go Now
        </Button>
      </CardContent>

      <SeoIllustration
        sx={{
          p: 3,
          width: 220,
          margin: { xs: 'auto', md: 'inherit' },
        }}
      />
    </RootStyle>
  );
}
