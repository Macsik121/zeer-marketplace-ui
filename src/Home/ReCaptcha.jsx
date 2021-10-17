import React from 'react';
import ReCaptchaV2 from 'react-google-recaptcha';

export default function ReCaptcha({
    handleToken,
    handleExpire
}) {
    return (
        <ReCaptchaV2
            sitekey={__RECAPTCHA_KEY__}
            onChange={handleToken}
            onExpired={handleExpire}
            className="re-captcha"
        />
    )
}
