import { useCallback, useState } from 'preact/hooks';
import {
  getInitialTimelineState,
  mapReplacer,
  TimelineData,
} from '../lib/timelineStore';
import './Backup.scss';

const Backup = () => {
  const state = useState<TimelineData>(getInitialTimelineState());
  const stateAsString = JSON.stringify(state[0], mapReplacer);
  const setState = state[1];

  const [exportMode, setExportMode] = useState(false);
  const [importMode, setImportMode] = useState(false);
  const [importValue, setImportValue] = useState('');
  const [copied, setCopied] = useState(false);
  const [imported, setImported] = useState(false);

  const exportData = useCallback(() => {
    setExportMode(!exportMode);
  }, [exportMode]);

  const importData = useCallback(() => {
    setImportMode(!importMode);
  }, [importMode]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(stateAsString);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }, [stateAsString]);

  const executeImport = useCallback(() => {
    const areYouSure = window.confirm(
      "Are you sure? If you proceed, you'll replace all your notes.",
    );
    if (importValue !== '' && areYouSure) {
      window.localStorage.setItem('state', importValue);
      setState(getInitialTimelineState());
      setImportValue('');
      setImported(true);
      setTimeout(() => {
        setImported(false);
      }, 1000);
    }
  }, [importValue, setState]);

  return (
    <section class="backup">
      <section class="export">
        <button
          aria-label="Export your data"
          aria-pressed={exportMode}
          onClick={exportData}
        >
          Export Data&nbsp;
          {exportMode ? (
            <i
              aria-hidden="true"
              class="fa-solid fa-arrow-down"
            />
          ) : (
            <i
              aria-hidden="true"
              class="fa-solid fa-arrow-up"
            />
          )}
        </button>
        {exportMode && (
          <>
            <button
              aria-label="Copy your note data as JSON to the clipboard"
              aria-pressed={copied}
              onClick={copyToClipboard}
            >
              {copied === false ? (
                <>
                  Copy&nbsp;
                  <i
                    aria-hidden="true"
                    class="fa-solid fa-clipboard"
                  />
                </>
              ) : (
                <>
                  Copied&nbsp;
                  <i
                    aria-hidden="true"
                    class="fa-solid fa-check"
                  />
                </>
              )}
            </button>
            <textarea
              readOnly
              value={stateAsString}
            />
          </>
        )}
      </section>
      <section class="import">
        <button
          aria-label="Import your data as JSON"
          aria-pressed={importMode}
          onClick={importData}
        >
          Import Data&nbsp;
          {importMode ? (
            <i
              aria-hidden="true"
              class="fa-solid fa-arrow-down"
            />
          ) : (
            <i
              aria-hidden="true"
              class="fa-solid fa-arrow-up"
            />
          )}
        </button>
        {importMode && (
          <>
            <button
              aria-label="Import the JSON data copied into the text box below. Warning — this will overwrite your existing daynotes"
              aria-pressed={imported}
              onClick={executeImport}
            >
              {imported === false ? (
                <>
                  Import&nbsp;
                  <i
                    aria-hidden="true"
                    class="fa-solid fa-upload"
                  />
                  <p class="warning">
                    (warning — this will overwrite your existing daynotes)
                  </p>
                </>
              ) : (
                <>
                  Imported&nbsp;
                  <i
                    aria-hidden="true"
                    class="fa-solid fa-check"
                  />
                </>
              )}
            </button>
            <textarea
              onInput={(e) => setImportValue(e.target?.value)}
              value={importValue}
            />
          </>
        )}
      </section>
    </section>
  );
};

export default Backup;
