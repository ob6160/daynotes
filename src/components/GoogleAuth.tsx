import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { FunctionalComponent } from 'preact';

interface GoogleAuthProps {
  googleClientId: string;
}

const GoogleAuth: FunctionalComponent<GoogleAuthProps> = ({
  googleClientId,
}) => {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <details>
        <summary>
          Google cloud sync is in development and won't work yet!
        </summary>

        <GoogleLogin
          theme="filled_black"
          width="100"
          onSuccess={(credentialResponse) => {
            console.log(credentialResponse);
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </details>
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
