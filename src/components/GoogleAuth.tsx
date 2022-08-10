import {
  GoogleLogin,
  GoogleOAuthProvider,
  useGoogleLogin,
} from '@react-oauth/google';
import { FunctionalComponent } from 'preact';

interface GoogleAuthProps {
  googleClientId: string;
}

const LoginThing = () => {
  const googleLogin = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/drive',
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      // fetching userinfo can be done on the client or the server
      const userInfo = await fetch(
        'https://www.googleapis.com/drive/v3/about?fields=*',
        {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        },
      );

      console.log(await userInfo.text());
    },
  });

  return <button onClick={() => googleLogin()}>test</button>;
};

const GoogleAuth: FunctionalComponent<GoogleAuthProps> = ({
  googleClientId,
}) => {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <LoginThing />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
