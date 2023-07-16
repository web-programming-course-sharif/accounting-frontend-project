import PropTypes from 'prop-types';
import {Link as RouterLink} from 'react-router-dom';
// @mui
import {Button, Card, Link, Stack, Typography} from '@mui/material';
// utils
import {fDate} from '../../../../utils/formatTime';
import {fCurrency} from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

AccountBillingInvoiceHistory.propTypes = {
    invoices: PropTypes.array,
};

export default function AccountBillingInvoiceHistory({invoices}) {
    return (
        <Card sx={{p: 3}}>
            <Typography variant="subtitle1" sx={{mb: 3, display: 'block'}}>
                Invoice History
            </Typography>

            <Stack spacing={3} alignItems="flex-end">
                <Stack spacing={2} sx={{width: 1}}>
                    {invoices.map((invoice) => (
                        <Stack key={invoice.id} direction="row" justifyContent="space-between" sx={{width: 1}}>
                            <Typography variant="body2" sx={{minWidth: 160}}>
                                {fDate(invoice.createdAt)}
                            </Typography>
                            <Typography variant="body2">{fCurrency(invoice.price)}</Typography>
                            <Link component={RouterLink} to="#">
                                PDF
                            </Link>
                        </Stack>
                    ))}
                </Stack>

                <Button size="small" endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'}/>}>
                    All invoices
                </Button>
            </Stack>
        </Card>
    );
}
