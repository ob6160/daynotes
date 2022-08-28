import {
  TokenResponse,
  GoogleOAuthProvider,
  useGoogleLogin,
} from '@react-oauth/google';
import { FunctionalComponent } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import {
  DateTimestamp,
  getTodayTimestamp,
  mapReplacer,
  sharedTimelineState,
} from '../lib/timelineStore';

const fileNameFromTimestamp = (timestamp?: DateTimestamp) =>
  timestamp ? `daynotes_sync_${timestamp}.json` : `daynotes_sync.json`;

const constructBackupUploadBody = (
  content: string,
  timestamp?: DateTimestamp,
) => {
  const metadata = JSON.stringify({
    description: 'Synchronised data from daynotes',
    name: fileNameFromTimestamp(timestamp),
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

const uploadSyncFile = (accessToken: string, timelineState: string) =>
  fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/related;boundary=--',
      },
      body: constructBackupUploadBody(timelineState, getTodayTimestamp()),
    },
  );

const checkBackupExists = async (
  accessToken: string,
  timestamp?: DateTimestamp,
) => {
  const fileName = fileNameFromTimestamp(timestamp);
  const fileSearchQuery = encodeURIComponent(`name contains '${fileName}'`);
  const fileSearchResult = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${fileSearchQuery}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    },
  );
  const files = (await fileSearchResult.json())?.files;
  const tooManySyncFilesExist = files.length > 1 && files.length !== 0;
  if (tooManySyncFilesExist) {
    console.error(
      'More than one sync file exists.. please ensure that there is only one per timestamp',
    );
  }
  return files?.[0];
};

const getBackupFileContents = async (accessToken: string, fileId: string) => {
  const fileSearchResult = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    },
  );
  return fileSearchResult.json();
};

const listSyncFiles = (accessToken: string) => {
  const searchQuery = encodeURIComponent("name contains 'daynotes_sync'");
  return fetch(`https://www.googleapis.com/drive/v3/files?q=${searchQuery}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });
};

const GoogleLogin = () => {
  const $timelineState = useStore(sharedTimelineState);
  const stateAsString = JSON.stringify($timelineState, mapReplacer);

  const [availableNotes, setAvailableNotes] = useState([]);

  const googleLoginSuccessHandler = useCallback(
    async (
      tokenResponse: Omit<
        TokenResponse,
        'error' | 'error_description' | 'error_uri'
      >,
    ) => {
      const existingBackup = await checkBackupExists(
        tokenResponse.access_token,
        getTodayTimestamp(),
      );

      const { name, id } = existingBackup ?? {};
      console.log(existingBackup);
      if (typeof id === 'undefined') {
        await uploadSyncFile(tokenResponse.access_token, stateAsString);
      }

      console.log(await getBackupFileContents(tokenResponse.access_token, id));

      const result = await listSyncFiles(tokenResponse.access_token);
      const searchResultJSON = await result.json();
      setAvailableNotes(searchResultJSON?.files);
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

  return (
    <>
      <button onClick={googleLoginClickHandler}>Google sync</button>
      <ul>
        {availableNotes.map(({ name, id }) => (
          <li key={id}>{name}</li>
        ))}
      </ul>
    </>
  );
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
