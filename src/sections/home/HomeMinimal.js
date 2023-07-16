// @mui
import {alpha, useTheme, styled} from '@mui/material/styles';
import {Box, Card, Container, Typography} from '@mui/material';
import {useTranslation} from "react-i18next";
// components
import Image from '../../components/Image';
import {MotionInView, varFade} from '../../components/animate';

// ----------------------------------------------------------------------

const CARDS = [{
    icon: 'https://minimal-assets-api.vercel.app/assets/icons/ic_design.svg',
    title: 'UI & UX Design',
    description: 'Accountant with a very attractive UI helps you easily manage your income and expenses with a few simple clicks',
}, {
    icon: 'https://minimal-assets-api.vercel.app/assets/icons/ic_code.svg',
    title: 'Development',
    description: 'Easy to customize and extend each component, saving you time and money.',
}, {
    icon: '/logo/logo_single.svg',
    title: 'Branding',
    description: 'Consistent design in colors, fonts ... makes brand recognition easy.',
},];

const shadowIcon = (color) => `drop-shadow(2px 2px 2px ${alpha(color, 0.48)})`;

const RootStyle = styled('div')(({theme}) => ({
    paddingTop: theme.spacing(15), [theme.breakpoints.up('md')]: {
        paddingBottom: theme.spacing(15),
    },
}));

const CardStyle = styled(Card)(({theme}) => {
    const shadowCard = (opacity) => theme.palette.mode === 'light' ? alpha(theme.palette.grey[500], opacity) : alpha(theme.palette.common.black, opacity);

    return {
        border: 0,
        maxWidth: 380,
        minHeight: 440,
        margin: 'auto',
        textAlign: 'center',
        padding: theme.spacing(10, 5, 0),
        boxShadow: theme.customShadows.z12,
        [theme.breakpoints.up('md')]: {
            boxShadow: 'none', backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        },
        '&.cardLeft': {
            [theme.breakpoints.up('md')]: {marginTop: -40},
        },
        '&.cardCenter': {
            [theme.breakpoints.up('md')]: {
                marginTop: -80,
                backgroundColor: theme.palette.background.paper,
                boxShadow: `-40px 40px 80px 0 ${shadowCard(0.4)}`,
                '&:before': {
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: -1,
                    content: "''",
                    margin: 'auto',
                    position: 'absolute',
                    width: 'calc(100% - 40px)',
                    height: 'calc(100% - 40px)',
                    borderRadius: Number(theme.shape.borderRadius) * 2,
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: `-20px 20px 40px 0 ${shadowCard(0.12)}`,
                },
            },
        },
    };
});

// ----------------------------------------------------------------------

export default function HomeMinimal() {
    const {t} = useTranslation()
    const theme = useTheme();
    const isLight = theme.palette.mode === 'light';

    return (<RootStyle>
        <Container>
            <Box
                sx={{
                    textAlign: 'center', mb: {xs: 10, md: 25},
                }}
            >
                <MotionInView variants={varFade().inUp}>
                    <Typography component="div" variant="overline" sx={{mb: 2, color: 'text.disabled'}}>
                        {t("Accountant")}
                    </Typography>
                </MotionInView>
                <MotionInView variants={varFade().inDown}>
                    <Typography variant="h2">{t("What Accountant helps you?")}</Typography>
                </MotionInView>
            </Box>

            <Box
                sx={{
                    display: 'grid',
                    gap: {xs: 5, lg: 10},
                    gridTemplateColumns: {xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)'},
                }}
            >
                {CARDS.map((card, index) => (<MotionInView variants={varFade().inUp} key={card.title}>
                    <CardStyle className={(index === 0 && 'cardLeft') || (index === 1 && 'cardCenter') || ''}>
                        <Image
                            src={card.icon}
                            alt={card.title}
                            sx={{
                                mb: 10,
                                mx: 'auto',
                                width: 40,
                                height: 40,
                                filter: (theme) => shadowIcon(theme.palette.primary.main), ...(index === 0 && {
                                    filter: (theme) => shadowIcon(theme.palette.info.main),
                                }), ...(index === 1 && {
                                    filter: (theme) => shadowIcon(theme.palette.error.main),
                                }),
                            }}
                        />
                        <Typography variant="h5" paragraph>
                            {t(card.title)}
                        </Typography>
                        <Typography
                            sx={{color: isLight ? 'text.secondary' : 'common.white'}}>{t(card.description)}</Typography>
                    </CardStyle>
                </MotionInView>))}
            </Box>
        </Container>
    </RootStyle>);
}
