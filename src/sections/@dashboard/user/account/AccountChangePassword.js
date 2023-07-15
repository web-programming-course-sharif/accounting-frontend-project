import * as Yup from 'yup';
import {useSnackbar} from 'notistack';
// form
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
// @mui
import {Alert, Card, Stack} from '@mui/material';
import {LoadingButton} from '@mui/lab';
// components
import {FormProvider, RHFTextField} from '../../../../components/hook-form';
import useAuth from "../../../../hooks/useAuth";

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
    const {changePassword} = useAuth();
    const {enqueueSnackbar} = useSnackbar();

    const ChangePassWordSchema = Yup.object().shape({
        oldPassword: Yup.string().required('Old Password is required'),
        newPassword: Yup.string().min(8, 'Password must be at least 8 characters').required('New Password is required'),
        confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
    });

    const defaultValues = {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    };

    const methods = useForm({
        resolver: yupResolver(ChangePassWordSchema),
        defaultValues,
    });

    const {
        setError,
        reset,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = methods;

    const onSubmit = async (data) => {
        try {
            await changePassword(data.oldPassword, data.newPassword, data.confirmNewPassword);
            reset();
            enqueueSnackbar('Update success!');
        } catch (error) {
            console.error(error);
            setError('afterSubmit', error);
        }
    };

    return (
        <Card sx={{p: 3}}>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3} alignItems="flex-end">
                        {!!errors.afterSubmit && <Alert style={{width: '100%'}} severity="error">{errors.afterSubmit.message}</Alert>}

                        <RHFTextField name="oldPassword" type="password" label="Old Password"/>

                        <RHFTextField name="newPassword" type="password" label="New Password"/>

                        <RHFTextField name="confirmNewPassword" type="password" label="Confirm New Password"/>

                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        Save Changes
                    </LoadingButton>
                </Stack>
            </FormProvider>
        </Card>
    );
}
