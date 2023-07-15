import {useEffect} from "react";
import PropTypes from 'prop-types';
import {useSnackbar} from 'notistack';
// form
import {useForm} from 'react-hook-form';
// @mui
import {Alert, Card, InputAdornment, Stack} from '@mui/material';
import {LoadingButton} from '@mui/lab';
// components
import Iconify from '../../../../components/Iconify';
import {FormProvider, RHFTextField} from '../../../../components/hook-form';
import useAuth from "../../../../hooks/useAuth";

// ----------------------------------------------------------------------

const SOCIAL_LINKS = [
    {
        value: 'facebookLink',
        icon: <Iconify icon={'eva:facebook-fill'} width={24} height={24}/>,
    },
    {
        value: 'instagramLink',
        icon: <Iconify icon={'ant-design:instagram-filled'} width={24} height={24}/>,
    },
    {
        value: 'linkedinLink',
        icon: <Iconify icon={'eva:linkedin-fill'} width={24} height={24}/>,
    },
    {
        value: 'twitterLink',
        icon: <Iconify icon={'eva:twitter-fill'} width={24} height={24}/>,
    },
];

// ----------------------------------------------------------------------

AccountSocialLinks.propTypes = {
    myProfile: PropTypes.shape({
        facebookLink: PropTypes.string,
        instagramLink: PropTypes.string,
        linkedinLink: PropTypes.string,
        twitterLink: PropTypes.string,
    }),
};

export default function AccountSocialLinks({myProfile}) {
    const {changeSocialLinks, user} = useAuth();
    const {enqueueSnackbar} = useSnackbar();

    const defaultValues = {
        facebookLink: user?.facebookLink || '',
        instagramLink: user?.instagramLink || '',
        linkedinLink: user?.linkedinLink || '',
        twitterLink: user?.twitterLink || '',
    };

    const methods = useForm({
        defaultValues,
    });

    const {
        setError,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = methods;

    useEffect(() => {
        if (user) {
            methods.reset({
                facebookLink: user?.facebookLink || '',
                instagramLink: user?.instagramLink || '',
                linkedinLink: user?.linkedinLink || '',
                twitterLink: user?.twitterLink || '',
            })
        }
    }, [methods, user])

    const onSubmit = async (data) => {
        try {
            await changeSocialLinks(data.facebookLink, data.instagramLink, data.linkedinLink, data.twitterLink)
            enqueueSnackbar('Update success!');
        } catch (error) {
            console.error(error)
            setError('afterSubmit', {
                type: 'manual',
                message: 'Something wrong happened'
            })
        }
    };

    const getLinkDisplayName = (linkValue) => {
        const socialLinkName = linkValue.substring(0, linkValue.indexOf('Link'))
        return `${socialLinkName.charAt(0).toUpperCase() + socialLinkName.slice(1)} link`
    }

    return (
        <Card sx={{p: 3}}>
            {!!errors.afterSubmit &&
                <Alert sx={{mb: 3}} severity="error">{errors.afterSubmit.message}</Alert>}
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3} alignItems="flex-end">
                    {SOCIAL_LINKS.map((link) => (
                        <RHFTextField
                            key={link.value}
                            name={link.value}
                            placeholder={myProfile[link.value] ? myProfile[link.value] : `Your ${getLinkDisplayName(link.value)}`}
                            label={getLinkDisplayName(link.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">{link.icon}</InputAdornment>,
                            }}
                        />
                    ))}

                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        Save Changes
                    </LoadingButton>
                </Stack>
            </FormProvider>
        </Card>
    );
}
