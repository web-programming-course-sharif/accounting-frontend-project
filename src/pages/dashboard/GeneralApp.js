import {useEffect, useState} from "react";
// @mui
import {useTheme} from '@mui/material/styles';
import {Button, Container, DialogTitle, Grid, Stack} from '@mui/material';
// redux
import {useDispatch, useSelector} from '../../redux/store';
import {closeModal as closeIncomeModal, getIncomes, openModal} from "../../redux/slices/income";
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
import {
    AppAreaInstalled,
    AppCurrentDownload,
    AppNewInvoice,
    AppTopAuthors,
    AppTopInstalledCountries,
    AppTopRelated,
    AppWelcome,
    AppWidget,
    AppWidgetSummary,
} from '../../sections/@dashboard/general/app';
import Iconify from "../../components/Iconify";
import useResponsive from "../../hooks/useResponsive";
import {DialogAnimate} from "../../components/animate";
import InOutForm from "../../sections/@dashboard/app/InOutForm";

// ----------------------------------------------------------------------

const selectedIncomeSelector = (state) => {
  const { incomes, selectedIncomeId } = state.income;
  if (selectedIncomeId) {
    return incomes.find((_event) => _event.id === selectedIncomeId);
  }
  return null;
};


export default function GeneralApp() {
    const {user} = useAuth();
    const theme = useTheme();
    const {themeStretch} = useSettings();
    const [isRemove, setIsRemove] = useState(false);

    const dispatch = useDispatch();
    const selectedIncome = useSelector(selectedIncomeSelector);
    const {incomes, isOpenModal} = useSelector((state) => state.income);

    useEffect(() => {
        dispatch(getIncomes());
    }, [dispatch]);

    const handleAddIncome = () => {
        dispatch(openModal());
    };

    const handleCloseIncomeModal = () => {
        dispatch(closeIncomeModal());
    };

    return (
        <Page title="General: App">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Button
                    variant="contained"
                    startIcon={<Iconify icon={'eva:plus-fill'} width={20} height={20}/>}
                    sx={{mr: 2}}
                    onClick={handleAddIncome}
                >
                    New Income
                </Button>
                <Button
                    variant="contained"
                    startIcon={<Iconify icon={'eva:plus-fill'} width={20} height={20}/>}
                    // onClick={handleAddEvent}
                >
                    New Outcome
                </Button>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                        <AppWelcome displayName={user?.displayName} isRemove={isRemove}
                                    setTrueIsRemove={() => setIsRemove(true)}/>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <AppWidgetSummary
                            title="Total Active Users"
                            percent={2.6}
                            total={18765}
                            chartColor={theme.palette.primary.main}
                            chartData={[5, 18, 12, 51, 68, 11, 39, 37, 27, 20]}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <AppWidgetSummary
                            title="Total Installed"
                            percent={0.2}
                            total={4876}
                            chartColor={theme.palette.chart.blue[0]}
                            chartData={[20, 41, 63, 33, 28, 35, 50, 46, 11, 26]}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <AppWidgetSummary
                            title="Total Downloads"
                            percent={-0.1}
                            total={678}
                            chartColor={theme.palette.chart.red[0]}
                            chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <AppCurrentDownload/>
                    </Grid>

                    <Grid item xs={12} md={6} lg={8}>
                        <AppAreaInstalled/>
                    </Grid>

                    <Grid item xs={12} lg={8}>
                        <AppNewInvoice/>
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <AppTopRelated/>
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <AppTopInstalledCountries/>
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <AppTopAuthors/>
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <Stack spacing={3}>
                            <AppWidget title="Conversion" total={38566} icon={'eva:person-fill'} chartData={48}/>
                            <AppWidget title="Applications" total={55566} icon={'eva:email-fill'} color="warning"
                                       chartData={75}/>
                        </Stack>
                    </Grid>
                </Grid>

                <DialogAnimate open={isOpenModal} onClose={handleCloseIncomeModal}>
                    <DialogTitle>{selectedIncome ? 'Edit Income' : 'Add Income'}</DialogTitle>

                    <InOutForm inOut={selectedIncome || {}} onCancel={handleCloseIncomeModal}/>
                </DialogAnimate>
            </Container>
        </Page>
    );
}
