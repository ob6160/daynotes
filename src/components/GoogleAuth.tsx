import {
  GoogleOAuthProvider,
  useGoogleLogin,
  TokenResponse,
} from '@react-oauth/google';

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
        const mode = tokenResponse.state === 'write' ? 'write' : 'read';

        const existingBackup = await checkBackupExists(
          tokenResponse.access_token,
          getTodayTimestamp(),
        );

        if (mode === 'write') {
          if (existingBackup) {
            await deleteFileById(tokenResponse.access_token, existingBackup.id);
          }

          const uploadedFileRef = await uploadSyncFile(
            tokenResponse.access_token,
            stateAsString,
          );

          console.log(
            'Successfully replaced and uploaded file',
            uploadedFileRef,
          );
        } else if (mode === 'read') {
          if (existingBackup) {
            const backupTimelineData = await getBackupFileContents(
              tokenResponse.access_token,
              existingBackup.id,
            );
            updateTimelineState(backupTimelineData);
          }
        }

        // const result = await listSyncFiles(tokenResponse.access_token);
        // const searchResultJSON = await result.json();
        // setAvailableNotes(searchResultJSON?.files);
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

  const googleReadClickHandler = useCallback(() => {
    return initiateGoogleLogin({ state: 'read' });
  }, [initiateGoogleLogin]);

  const googleWriteClickHandler = useCallback(() => {
    return initiateGoogleLogin({ state: 'write' });
  }, [initiateGoogleLogin]);

  return (
    <>
      <button onClick={googleReadClickHandler}>Google Drive read</button>
      <button onClick={googleWriteClickHandler}>Google Drive write</button>
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

const GoogleAuth = ({ googleClientId }: GoogleAuthProps) => {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <GoogleLogin />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
