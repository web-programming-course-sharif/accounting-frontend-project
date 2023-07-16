import {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import {useSnackbar} from "notistack";
// form
import {useForm} from "react-hook-form";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
// @mui
import {
    Alert,
    Box,
    Button,
    Card,
    Collapse,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Paper,
    Stack,
    Typography
} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
// components
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
import useAuth from "../../../../hooks/useAuth";
import FormProvider from '../../../../components/hook-form/FormProvider'
import {RHFSelect, RHFTextField} from "../../../../components/hook-form";

// ----------------------------------------------------------------------

AccountBillingPaymentMethod.propTypes = {
    isOpen: PropTypes.bool,
    onOpen: PropTypes.func,
    onCancel: PropTypes.func,
};

export default function AccountBillingPaymentMethod({isOpen, onOpen, onCancel}) {
    const {getAllBanks, getAllCards, addCard} = useAuth()
    const {enqueueSnackbar} = useSnackbar();
    const [cards, setCards] = useState(undefined)
    const [allBanks, setAllBanks] = useState(undefined)
    const [editCard, setEditCard] = useState(undefined)
    const [deleteCard, setDeleteCard] = useState(undefined)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        const fetchAllBanks = await getAllBanks()
        setAllBanks(fetchAllBanks)

        const fetchAllCards = await getAllCards()
        console.log(fetchAllCards)
        setCards(fetchAllCards)
    }, [])


    const AddCardSchema = Yup.object().shape({
        desiredName: Yup.string().required('Desired name required'),
        cardNumber: Yup.string().test('len', 'Card number must be valid', val => val.length === 16)
            .required('Card number required'),
        bank: Yup.string().required('bank is required'),
        initialBalance: Yup.string().required('Initial balance is required'),
    });

    useEffect(() => {
        console.log(editCard, deleteCard)
        if (editCard !== undefined) {
            setValue('desiredName', editCard.name)
            setValue('cardNumber', editCard.cardNumber)
            setValue('bank', editCard.bank.id)
            setValue('initialBalance', editCard.balance)
        } else if (deleteCard !== undefined) {
            setValue('desiredName', deleteCard.name)
            setValue('cardNumber', deleteCard.cardNumber)
            setValue('bank', deleteCard.bank.id)
            setValue('initialBalance', deleteCard.balance)
        } else {
            setValue('desiredName', '')
            setValue('cardNumber', '')
            setValue('bank', allBanks ? allBanks[0].id : 'Loading ...')
            setValue('initialBalance', 0)
        }
    }, [editCard, deleteCard])

    const defaultValues = {
        desiredName: '',
        cardNumber: '',
        bank: allBanks ? allBanks[0].id : 'Loading ...',
        initialBalance: 0,
    };

    const methods = useForm({
        resolver: yupResolver(AddCardSchema),
        defaultValues,
    });

    const {
        reset,
        setError,
        handleSubmit,
        setValue,
        formState: {errors, isSubmitting},
    } = methods;

    const onSubmit = async (data) => {
        try {
            let message = ''
            if (!editCard) {
                if (!deleteCard) {
                    message = 'Add card success'
                    await handleAddCardOnSubmit(data)
                } else {
                    message = 'Delete card success'
                }
            } else {
                message = 'Edit card success'
            }

            enqueueSnackbar(message);
            setEditCard(undefined);
            setDeleteCard(undefined);
        } catch (error) {
            console.error(error);
            if (!error.message) {
                setError('afterSubmit', {
                    type: 'manual',
                    message: 'Could not connect to server. Please try again later.',
                });
            } else {
                setError('afterSubmit', error);
            }
        }
    }

    const handleAddCardOnSubmit = async (data) => {
        const {cardNumber, bank, initialBalance, desiredName} = data
        console.log(cardNumber, bank, initialBalance, desiredName)
        const fetchCards = await addCard(cardNumber, +bank, +initialBalance, desiredName)
        setCards(fetchCards)
    }

    // Each card menu
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = (card) => () => {
        setEditCard(card)
        setDeleteCard(undefined)
        onOpen(true)
        handleClose()
    }

    const handleDelete = (card) => () => {
        setDeleteCard(card)
        setEditCard(undefined)
        onOpen(true)
        handleClose()
    }


    return (
        <Card sx={{p: 3}}>
            <Typography variant="overline" sx={{mb: 3, display: 'block', color: 'text.secondary'}}>
                Payment Method
            </Typography>


            <Grid container spacing={3}>
                {cards?.map((card, index) => (
                    <Grid item xs={12} md={6} key={card.id}>
                        <Paper
                            sx={{
                                p: 3,
                                position: 'relative',
                                border: (theme) => `solid 1px ${theme.palette.grey[500_32]}`,
                            }}
                        >
                            <Stack direction="row" alignItems="center" sx={{mb: 2}} spacing={2}>
                                <Image
                                    alt="icon"
                                    src={card.bank.icon}
                                    sx={{maxWidth: 36}}
                                />
                                <Typography variant="subtitle1">{card.name}</Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="subtitle2">{card.cardNumber.match(/.{1,4}/g).join(' ')}</Typography>
                                <Typography variant="subtitle1">{card.balance}</Typography>
                            </Stack>
                            <IconButton
                                sx={{
                                    top: 8,
                                    right: 8,
                                    position: 'absolute',
                                }}
                                aria-label="more"
                                id="long-button"
                                aria-haspopup="true"
                                onClick={handleClick}
                            >
                                <MoreVertIcon/>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                sx={{
                                    mr: 3
                                }}
                            >
                                <MenuItem onClick={handleEdit(card)}>
                                    <EditIcon fontSize="small" sx={{mr: 1}}/>
                                    Edit
                                </MenuItem>
                                <MenuItem onClick={handleDelete(card)} sx={{color: 'red'}}>
                                    <DeleteIcon fontSize="small" sx={{mr: 1}}/>
                                    Delete
                                </MenuItem>
                            </Menu>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{mt: 3}}>
                <Button size="small" startIcon={<Iconify icon={'eva:plus-fill'}/>} onClick={() => {
                    setEditCard(undefined)
                    setDeleteCard(undefined)
                    onOpen(true)
                }}>
                    Add new card
                </Button>
            </Box>

            <Collapse in={isOpen}>
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <Box
                        sx={{
                            padding: 3,
                            marginTop: 3,
                            borderRadius: 1,
                            bgcolor: 'background.neutral',
                        }}
                    >
                        <Stack spacing={3}>
                            <Typography variant="subtitle1">
                                {/* eslint-disable-next-line no-nested-ternary */}
                                {!editCard ? (!deleteCard ? 'Add new card' : 'Delete card') : 'Edit card'}
                            </Typography>
                            {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

                            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                                <RHFTextField fullWidth disabled={deleteCard !== undefined} name={"desiredName"}
                                              label="Desired Name"/>

                                <RHFTextField fullWidth disabled={deleteCard !== undefined} name={"cardNumber"}
                                              label="Card number"/>
                            </Stack>

                            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                                <RHFSelect
                                    select
                                    fullWidth
                                    SelectProps={{native: true}}
                                    disabled={deleteCard !== undefined}
                                    name={"bank"}
                                    label="Bank"
                                    InputLabelProps={{ shrink: true }}
                                >
                                    {!allBanks
                                        ? <option>Loading ...</option>
                                        : allBanks.map((bank) => (
                                            <option key={bank.id} value={bank.id}>
                                                {bank.name}
                                            </option>
                                        ))}
                                </RHFSelect>


                                <RHFTextField fullWidth disabled={deleteCard !== undefined} name={"initialBalance"}
                                              label="Initial Balance"/>
                            </Stack>

                            <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
                                <Button color="inherit" variant="outlined" onClick={() => {
                                    onCancel()
                                    setEditCard(undefined)
                                    setDeleteCard(undefined)
                                    reset(defaultValues)
                                }}>
                                    Cancel
                                </Button>
                                {
                                    !deleteCard ?
                                        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                            Save Change
                                        </LoadingButton>
                                        :
                                        <LoadingButton type="submit" variant="contained" loading={isSubmitting}
                                                       sx={{background: 'red'}}>
                                            Delete
                                        </LoadingButton>
                                }

                            </Stack>
                        </Stack>
                    </Box>
                </FormProvider>
            </Collapse>
        </Card>
    );
}
