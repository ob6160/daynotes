import {
  GoogleLogin,
  GoogleOAuthProvider,
  useGoogleLogin,
} from '@react-oauth/google';
import { FunctionalComponent } from 'preact';
import { useEffect } from 'preact/hooks';

interface GoogleAuthProps {
  googleClientId: string;
}

const GoogleAuth: FunctionalComponent<GoogleAuthProps> = ({
  googleClientId,
}) => {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <GoogleLogin
        theme="filled_black"
        width="100"
        login_uri="/oauth2/callback"
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
