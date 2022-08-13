import {
  TokenResponse,
  GoogleOAuthProvider,
  useGoogleLogin,
} from '@react-oauth/google';
import { FunctionalComponent } from 'preact';
import { useCallback } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import {
  dateToEpoch,
  mapReplacer,
  sharedTimelineState,
} from '../lib/timelineStore';

const constructBackupUploadBody = (content: string, timestamp?: number) => {
  const fileName = timestamp
    ? `daynotes_sync_${timestamp}.json`
    : `daynotes_sync.json`;

  const metadata = JSON.stringify({
    description: 'Synchronised data from daynotes',
    name: fileName,
    mimeType: 'application/json',
    properties: {
      type: 'daynotes_backup',
    },
  });

  return `
----
Content-Type: application/json; charset=UTF-8

${metadata}
----
Content-Transfer-Encoding: BINARY

${content}
------
  `;
};

const listSyncFiles = (accessToken: string) => {
  const searchQuery = 'title:daynotes_sync';
  return fetch(`https://www.googleapis.com/drive/v3/files?q=${searchQuery}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const GoogleLogin = () => {
  const $timelineState = useStore(sharedTimelineState);
  const stateAsString = JSON.stringify($timelineState, mapReplacer);

  const googleLoginSuccessHandler = useCallback(
    async (
      tokenResponse: Omit<
        TokenResponse,
        'error' | 'error_description' | 'error_uri'
      >,
    ) => {
      const uploadRequest = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&includeLabels=daynotes_backup',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
            'Content-Type': 'multipart/related;boundary=--',
          },
          body: constructBackupUploadBody(
            stateAsString,
            dateToEpoch(new Date()),
          ),
        },
      );

      console.log(await uploadRequest.text());
      console.log(await listSyncFiles(tokenResponse.access_token));
    },
    [stateAsString],
  );

  const initiateGoogleLogin = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/drive',
    onSuccess: googleLoginSuccessHandler,
  });

  const googleLoginClickHandler = useCallback(() => {
    return initiateGoogleLogin();
  }, [initiateGoogleLogin]);

  return <button onClick={googleLoginClickHandler}>test</button>;
};

interface GoogleAuthProps {
  googleClientId: string;
}

const GoogleAuth: FunctionalComponent<GoogleAuthProps> = ({
  googleClientId,
}) => {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <GoogleLogin />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
