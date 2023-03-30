// HOC/withAuth.jsx
import { ACCESS_TOKEN, USER } from "@/utils/config";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
// the below function could be any of your custom implementation for verifying the token. I've added it as means of explanantion

const authLogin = (WrapperComponent: any) => {
    // eslint-disable-next-line react/display-name
    return (props: any) => {
        const Router = useRouter();
        const [verified, setVerified] = useState<boolean>(false);

        useEffect(() => {
            const accessToken = localStorage.getItem(ACCESS_TOKEN);
            const user = JSON.parse(localStorage.getItem(USER) || '{}');

            // if no accessToken was found,then we redirect to "/" page.
            if (!accessToken && !user) {
                Router.replace("/");
            } else {
                // verifies the token.
                const data = localStorage.getItem(ACCESS_TOKEN);
                // if token was verified we set the state.

                if (data && user.isPhoneConfirmed === true) {
                    Router.replace("../home");
                    setVerified(true);
                }
            }
        }, []);

        if (verified === false) {
            return <WrapperComponent {...props} />;
        } else {
            return null;
        }
    };
};

export default authLogin;
