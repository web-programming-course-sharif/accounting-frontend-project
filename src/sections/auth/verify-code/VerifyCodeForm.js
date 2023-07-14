import * as Yup from 'yup';
import {useSnackbar} from 'notistack';
import {useLocation, useNavigate} from 'react-router-dom';
import {useEffect} from 'react';
// form
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
// @mui
import {Alert, OutlinedInput, Stack} from '@mui/material';
import {LoadingButton} from '@mui/lab';
// routes
import {PATH_DASHBOARD} from '../../../routes/paths';
import useAuth from "../../../hooks/useAuth";
import useIsMountedRef from "../../../hooks/useIsMountedRef";

// ----------------------------------------------------------------------

export default function VerifyCodeForm() {
    const {state} = useLocation();
    const {verify} = useAuth();
    const navigate = useNavigate();

    const {enqueueSnackbar} = useSnackbar();
    const isMountedRef = useIsMountedRef();

    const VerifyCodeSchema = Yup.object().shape({
        code1: Yup.string().required('Code is required'),
        code2: Yup.string().required('Code is required'),
        code3: Yup.string().required('Code is required'),
        code4: Yup.string().required('Code is required'),
        code5: Yup.string().required('Code is required'),
        code6: Yup.string().required('Code is required'),
    });

    const defaultValues = {
        code1: '',
        code2: '',
        code3: '',
        code4: '',
        code5: '',
        code6: '',
    };


    const {
        setError,
        watch,
        control,
        setValue,
        handleSubmit,
        formState: {errors, isSubmitting, isValid},
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(VerifyCodeSchema),
        defaultValues,
    });


    const values = watch();

    useEffect(() => {
        document.addEventListener('paste', handlePasteClipboard);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = async (data) => {
        try {
            await verify(state.phoneNumber, Object.values(data).join(''));
            // await new Promise((resolve) => setTimeout(resolve, 500));
            // console.log('code:', Object.values(data).join(''));

            enqueueSnackbar('Verify success!');

            navigate(PATH_DASHBOARD.root, {replace: true});
        } catch (error) {
            console.error(error);
            if (isMountedRef.current) {
                setError('afterSubmit', error);
            }
        }
    };

    const handlePasteClipboard = (event) => {
        let data = event?.clipboardData?.getData('Text') || '';

        data = data.split('');

        [].forEach.call(document.querySelectorAll('#field-code'), (node, index) => {
            node.value = data[index];
            const fieldIndex = `code${index + 1}`;
            setValue(fieldIndex, data[index]);
        });
    };

    const handlePrevCodeFieldFocus = (fieldIntIndex) => {
        const prevField = document.querySelector(`input[name=code${fieldIntIndex - 1}]`);

        if (prevField !== null) {
            prevField.focus();
        }
    }

    const handleChangeWithNextField = (event, handleChange) => {
        const {maxLength, value, name} = event.target;
        const fieldIndex = name.replace('code', '');

        const fieldIntIndex = Number(fieldIndex);

        if (value.length >= maxLength) {
            if (fieldIntIndex < 6) {
                const nextfield = document.querySelector(`input[name=code${fieldIntIndex + 1}]`);

                if (nextfield !== null) {
                    nextfield.focus();
                }
            }
        }

        handleChange(event);
    };

    return (
        <form name={'verify-code-form-form'} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
                {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
                <Stack direction="row" spacing={2} justifyContent="center">
                    {Object.keys(values).map((name, index) => (
                        <Controller
                            key={name}
                            name={`code${index + 1}`}
                            control={control}
                            render={({field}) => (
                                <OutlinedInput
                                    {...field}
                                    id="field-code"
                                    autoFocus={index === 0}
                                    placeholder="-"
                                    onChange={(event) => handleChangeWithNextField(event, field.onChange)}
                                    onKeyDown={(e) => {
                                        const {key} = e;
                                        if (e.target.value.length === 0 && (key === "Backspace" || key === "Delete")) {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handlePrevCodeFieldFocus(index + 1)
                                        } else if (key === "Return"  || key === "Enter") {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleSubmit(onSubmit)();
                                        }
                                    }}
                                    inputProps={{
                                        maxLength: 1,
                                        sx: {
                                            p: 0,
                                            textAlign: 'center',
                                            width: {xs: 36, sm: 56},
                                            height: {xs: 36, sm: 56},
                                        },
                                    }}
                                />
                            )}
                        />
                    ))}
                </Stack>
            </Stack>

            <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
                disabled={!isValid}
                sx={{mt: 3}}
            >
                Verify
            </LoadingButton>
        </form>
    );
}
