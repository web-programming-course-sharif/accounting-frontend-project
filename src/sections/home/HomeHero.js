import {m} from 'framer-motion';
import {Link as RouterLink} from 'react-router-dom';
import {useTranslation} from "react-i18next";
// @mui
import {styled} from '@mui/material/styles';
import {Button, Box, Container, Typography, Stack} from '@mui/material';
// routes
import {PATH_DASHBOARD} from '../../routes/paths';
// components
import Iconify from '../../components/Iconify';
import {MotionContainer, varFade} from '../../components/animate';

// ----------------------------------------------------------------------

const RootStyle = styled(m.div)(({theme}) => ({
    position: 'relative', backgroundColor: theme.palette.grey[400], [theme.breakpoints.up('md')]: {
        top: 0, left: 0, width: '100%', height: '100vh', display: 'flex', position: 'fixed', alignItems: 'center',
    },
}));

const ContentStyle = styled((props) => <Stack spacing={5} {...props} />)(({theme}) => ({
    zIndex: 10,
    maxWidth: 520,
    margin: 'auto',
    textAlign: 'center',
    position: 'relative',
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(15),
    [theme.breakpoints.up('md')]: {
        margin: 'unset', textAlign: 'left',
    },
}));


const HeroImgStyle = styled(m.img)(({theme}) => ({
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 8,
    width: '100%',
    margin: 'auto',
    position: 'absolute',
    [theme.breakpoints.up('lg')]: {
        right: '8%', width: 'auto', height: '48vh',
    },
}));

// ----------------------------------------------------------------------

export default function HomeHero() {
    const {t} = useTranslation()
    return (<MotionContainer>
            <RootStyle>


                <HeroImgStyle
                    alt="hero"
                    src="https://minimal-assets-api.vercel.app/assets/images/home/hero.png"
                    variants={varFade().inUp}
                />

                <Container>
                    <ContentStyle>
                        <m.div variants={varFade().inRight}>
                            <Typography variant="h1" sx={{color: 'common.white'}}>
                                Start managing <br/>
                                finances with <br/> an
                                <Typography component="span" variant="h1" sx={{color: 'primary.main'}}>
                                    &nbsp;Accountant
                                </Typography>
                            </Typography>
                        </m.div>

                        <m.div variants={varFade().inRight}>
                            <Typography sx={{color: 'common.white'}}>
                                This platform is an advanced accountant to calculate your income and expenses so that
                                you can easily calculate your life income and expenses report.
                            </Typography>
                        </m.div>

                        <Stack spacing={2.5} alignItems="center" direction={{xs: 'column', md: 'row'}}>
                            <></>
                        </Stack>

                        <m.div variants={varFade().inRight}>
                            <Button
                                size="large"
                                variant="contained"
                                component={RouterLink}
                                to={PATH_DASHBOARD.root}
                                startIcon={<Iconify icon={'eva:flash-fill'} width={20} height={20}/>}
                            >
                                {t("Sign Up")}
                            </Button>
                        </m.div>

                        <Stack spacing={2.5}>
                            <></>
                        </Stack>
                    </ContentStyle>
                </Container>
            </RootStyle>
            <Box sx={{height: {md: '100vh'}}}/>
        </MotionContainer>);
}
