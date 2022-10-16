import {
  GoogleOAuthProvider,
  useGoogleLogin,
  TokenResponse,
} from '@react-oauth/google';
import Cookies from 'js-cookie';
import { useCallback, useState } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import {
  DateTimestamp,
  getTodayTimestamp,
  mapReplacer,
  mapReviver,
  sharedTimelineState,
  updateTimelineState,
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

const deleteFileById = (accessToken: string, fileId: string) =>
  fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

const uploadSyncFile = (
  accessToken: string,
  timelineState: string,
): Promise<DriveFile | undefined> =>
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
  ).then((res) => res.json());

type DriveFile = {
  kind: string;
  id: string;
  name: string;
  mimeType: string;
};

const checkBackupExists = async (
  accessToken: string,
  timestamp?: DateTimestamp,
): Promise<DriveFile | undefined> => {
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
  const fileSearchResultJSON: { files?: DriveFile[] } =
    await fileSearchResult.json();

  const { files } = fileSearchResultJSON;

  if (files === undefined) {
    return;
  }

  const tooManySyncFilesExist = files.length > 1 && files.length !== 0;
  if (tooManySyncFilesExist) {
    throw new Error(
      'More than one sync file exists.. please ensure that there is only one per timestamp',
    );
  }

  return files[0];
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
  return fileSearchResult.text().then((text) => JSON.parse(text, mapReviver));
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

const readSessionCookie = (): TokenResponse =>
  JSON.parse(Cookies.get('daynotes_session') || '');

const writeTodaysBackup = async (state: string, accessToken: string) => {
  const existingBackup = await checkBackupExists(
    accessToken,
    getTodayTimestamp(),
  );

  if (existingBackup) {
    await deleteFileById(accessToken, existingBackup.id);
  }

  const uploadedFileRef = await uploadSyncFile(accessToken, state);

  console.log('Successfully replaced and uploaded file', uploadedFileRef);
};

const restoreFromBackup = async (backupFileId: string, accessToken: string) => {
  const backupTimelineData = await getBackupFileContents(
    accessToken,
    backupFileId,
  );
  updateTimelineState(backupTimelineData);
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
      try {
        const expiresIn = new Date();
        expiresIn.setSeconds(expiresIn.getSeconds() + tokenResponse.expires_in);
        Cookies.set('daynotes_session', JSON.stringify(tokenResponse), {
          sameSite: 'Strict',
          secure: true,
          expires: expiresIn,
        });

        const mode =
          tokenResponse.state === 'write'
            ? 'write'
            : tokenResponse.state === 'read_latest'
            ? 'read_latest'
            : 'read';

        if (mode === 'write') {
          writeTodaysBackup(stateAsString, tokenResponse.access_token);
        } else if (mode === 'read_latest') {
          const existingBackup = await checkBackupExists(
            tokenResponse.access_token,
            getTodayTimestamp(),
          );
          if (existingBackup) {
            restoreFromBackup(existingBackup.id, tokenResponse.access_token);
          }
        } else if (mode === 'read') {
          const result = await listSyncFiles(tokenResponse.access_token);
          const searchResultJSON = await result.json();
          setAvailableNotes(searchResultJSON?.files);
        }
      } catch (e) {
        console.error(e);
      }
    },
    [stateAsString],
  );

  const initiateGoogleLogin = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/drive',
    onSuccess: googleLoginSuccessHandler,
  });

  const googleReadLatestClickHandler = useCallback(async () => {
    try {
      const sessionCookie = readSessionCookie();
      const existingBackup = await checkBackupExists(
        sessionCookie.access_token,
        getTodayTimestamp(),
      );
      if (existingBackup) {
        restoreFromBackup(existingBackup.id, sessionCookie.access_token);
        console.log('Backup read success!');
      }
    } catch (e: unknown) {
      return initiateGoogleLogin({ state: 'read_latest' });
    }
  }, [initiateGoogleLogin]);

  const googleWriteClickHandler = useCallback(() => {
    return initiateGoogleLogin({ state: 'write' });
  }, [initiateGoogleLogin]);

  return (
    <>
      <button onClick={googleReadLatestClickHandler}>
        Google Drive read latest
      </button>
      <button onClick={googleWriteClickHandler}>Google Drive write</button>
      <ul>
        {availableNotes.map(({ name, id }) => (
          <li key={id}>
            {name} <button>Restore</button>
          </li>
        ))}
      </ul>
    </>
  );
};

interface GoogleAuthProps {
  googleClientId: string;
}

const GoogleAuth = ({ googleClientId }: GoogleAuthProps) => {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <GoogleLogin />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
