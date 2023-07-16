import {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import merge from 'lodash/merge';
import {useSnackbar} from 'notistack';
// form
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
// @mui
import {Alert, Box, Button, DialogActions, IconButton, Stack, TextField, Tooltip} from '@mui/material';
import {LoadingButton, MobileDateTimePicker} from '@mui/lab';
// redux
import {useDispatch} from '../../../redux/store';
import {createIncome, deleteIncome, updateIncome} from '../../../redux/slices/income';
// components
import Iconify from '../../../components/Iconify';
import {ColorSinglePicker} from '../../../components/color-utils';
import {FormProvider, RHFSelect, RHFTextField} from '../../../components/hook-form';
import useAuth from "../../../hooks/useAuth";

// ----------------------------------------------------------------------

const COLOR_OPTIONS = [
    '#00AB55', // theme.palette.primary.main,
    '#1890FF', // theme.palette.info.main,
    '#54D62C', // theme.palette.success.main,
    '#FFC107', // theme.palette.warning.main,
    '#FF4842', // theme.palette.error.main
    '#04297A', // theme.palette.info.darker
    '#7A0C2E', // theme.palette.error.darker
];

const getInitialValues = (income) => {
    const _income = {
        title: '',
        category: '',
        card: undefined,
        price: 0,
        date: new Date(),
        description: '',
        textColor: '#1890FF',
    };

    if (income) {
        return merge({}, _income, income);
    }

    return _income;
};

// ----------------------------------------------------------------------

InOutForm.propTypes = {
    inOut: PropTypes.object,
    onCancel: PropTypes.func,
};

export default function InOutForm({inOut, onCancel}) {
    const {enqueueSnackbar} = useSnackbar();
    const dispatch = useDispatch();
    const {getAllCategories, getAllCards} = useAuth()
    const [allCategories, setAllCategories] = useState([])
    const [allCards, setAllCards] = useState([])

    const isCreating = Object.keys(inOut).length === 0;

    const EventSchema = Yup.object().shape({
        title: Yup.string().max(255).required('Title is required'),
        category: Yup.string().required('Category is required'),
        card: Yup.string(),
        price: Yup.number().required('Price is required'),
        date: Yup.date().required('Date is required'),
        description: Yup.string().max(5000),
        textColor: Yup.string().required('Color is required'),
    });

    const methods = useForm({
        resolver: yupResolver(EventSchema),
        defaultValues: getInitialValues(inOut),
    });

    const {
        setError,
        reset,
        watch,
        control,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = methods;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        try {
            const fetchAllCategories = await getAllCategories()
            setAllCategories(fetchAllCategories)
        } catch (error) {
            console.log(error)
            if (!error.message) {
                setError('afterSubmit', {
                    type: 'manual',
                    message: 'Could not connect to server. Please try again later.',
                });
            } else {
                setError('afterSubmit', error);
            }
        }

        try {
            const allCards = await getAllCards()
            setAllCards(allCards)
        } catch (error) {
            console.log(error)
            if (!error.message) {
                setError('afterSubmit', {
                    type: 'manual',
                    message: 'Could not connect to server. Please try again later.',
                });
            } else {
                setError('afterSubmit', error);
            }
        }
    }, [])

    const onSubmit = async (data) => {
        try {
            const newIncome = {
                title: data.title,
                category: data.category,
                card: data.card,
                price: data.price,
                date: data.date,
                description: data.description,
                textColor: data.textColor,
            };
            if (inOut.id) {
                dispatch(updateIncome(inOut.id, newIncome));
                enqueueSnackbar('Update success!');
            } else {
                enqueueSnackbar('Create success!');
                dispatch(createIncome(newIncome));
            }
            onCancel();
            reset();
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
    };

    const handleDelete = async () => {
        if (!inOut.id) return;
        try {
            onCancel();
            dispatch(deleteIncome(inOut.id));
            enqueueSnackbar('Delete success!');
        } catch (error) {
            console.error(error);
        }
    };

    const values = watch();

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3} sx={{p: 3}}>
                {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
                <RHFTextField name="title" label="Title"/>

                <Stack direction="row" alignItems="center" spacing={{xs: 0.5, sm: 1.5}}>
                    <RHFSelect
                        select
                        fullWidth
                        SelectProps={{native: true}}
                        name={"category"}
                        label="Category"
                        InputLabelProps={{shrink: true}}
                    >
                        {allCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </RHFSelect>

                    <RHFSelect
                        select
                        fullWidth
                        SelectProps={{native: true}}
                        name={"card"}
                        label="Card"
                        InputLabelProps={{shrink: true}}
                    >
                        {allCards.map((card) => (
                            <option key={card.id} value={card.id}>
                                {card.name} - {card.cardNumber}
                            </option>
                        ))}
                    </RHFSelect>
                </Stack>

                <RHFTextField name="price" label="Price"/>

                <Controller
                    name="date"
                    control={control}
                    render={({field}) => (
                        <MobileDateTimePicker
                            {...field}
                            label="Date"
                            inputFormat="dd/MM/yyyy hh:mm a"
                            renderInput={(params) => <TextField {...params} fullWidth/>}
                        />
                    )}
                />

                <RHFTextField name="description" label="Description" multiline rows={4}/>

                <Controller
                    name="textColor"
                    control={control}
                    render={({field}) => (
                        <ColorSinglePicker value={field.value} onChange={field.onChange} colors={COLOR_OPTIONS}/>
                    )}
                />
            </Stack>

            <DialogActions>
                {!isCreating && (
                    <Tooltip title="Delete Event">
                        <IconButton onClick={handleDelete}>
                            <Iconify icon="eva:trash-2-outline" width={20} height={20}/>
                        </IconButton>
                    </Tooltip>
                )}
                <Box sx={{flexGrow: 1}}/>

                <Button variant="outlined" color="inherit" onClick={onCancel}>
                    Cancel
                </Button>

                <LoadingButton type="submit" variant="contained" loading={isSubmitting} loadingIndicator="Loading...">
                    Add
                </LoadingButton>
            </DialogActions>
        </FormProvider>
    );
}
