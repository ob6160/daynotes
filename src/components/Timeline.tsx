import 'preact/debug';
import { FunctionalComponent } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import Day from './Day/Day';
import {
  Day as DayType,
  Mood,
  TimelineData,
  TimelineStore,
} from '../lib/timelineStore';
import './Timeline.scss';

const getPersistedState = () => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const localStorageState = window.localStorage.getItem('state');

    const parsed = JSON.parse(localStorageState, mapReviver);
    if (!(parsed instanceof Map)) {
      throw 'Invalid data type';
    }
    return parsed;
  } catch {
    console.log('Problem parsing localStorage state');
  }
};

const mapReplacer = (_key, value: unknown) => {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()),
    };
  }
  return value;
};

// TODO: use zod to verify that the data type is as-expected.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapReviver = (_key, value: any) => {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value?.value);
    }
  }
  return value;
};

// Returns the timestamp for the start of a given day.
const dateToEpoch = (date: Date) => {
  return date.setHours(0, 0, 0, 0).valueOf();
};

const getDaysIncludingFirstEntry = (timeline: TimelineData) => {
  const oneDayInMs = 1000 * 60 * 60 * 24;
  const today = dateToEpoch(new Date());

  const storedDayTimestamps = Array.from(timeline.keys());
  const earliestStoredDay = Math.min(...storedDayTimestamps);

  const daysIncludingFirstEntry = [];
  for (
    let currentDay = earliestStoredDay;
    currentDay <= today;
    currentDay += oneDayInMs
  ) {
    daysIncludingFirstEntry.push(currentDay);
  }

  return daysIncludingFirstEntry.sort((a, b) => b - a);
};

const getInitialTimelineState = () => {
  return (
    getPersistedState() ??
    new Map([
      [
        dateToEpoch(new Date()),
        {
          notes: {},
          books: {},
          links: {},
          pictures: {},
          songs: {},
          mood: 'neutral' as Mood,
        } as DayType,
      ],
    ])
  );
};

const Timeline: FunctionalComponent = () => {
  const state = useState<TimelineData>(getInitialTimelineState());
  const setState = state[1];
  const stateAsString = JSON.stringify(state[0], mapReplacer);

  // Fill in the gaps, so we render all the days — even if there are no entries.
  const daysToRender = getDaysIncludingFirstEntry(state[0]);

  const timeline = daysToRender.map((date) => (
    <Day
      key={date}
      date={date}
    />
  ));

  useEffect(
    // eslint-disable-next-line prefer-arrow-callback
    function updateStore() {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('state', stateAsString);
      }
    },
    [state, stateAsString],
  );

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
    <TimelineStore.Provider value={state}>
      <section class="timeline">
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

        <ul class="link-card-grid">{timeline}</ul>
      </section>
    </TimelineStore.Provider>
  );
};

export default Timeline;
