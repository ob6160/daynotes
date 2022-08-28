import { atom, WritableAtom } from 'nanostores';
import { createContext } from 'preact';
import { useCallback, useContext, useMemo } from 'preact/hooks';

export type Note = {
  title?: string;
  content?: string;
  complete: boolean;
};

export type Picture = {
  title?: string;
  url: string;
  complete: boolean;
};

export type Link = {
  title?: string;
  url: string;
  complete: boolean;
};

export type Song = {
  title: string;
  url: string;
  complete: boolean;
};

export type Book = {
  title: string;
  complete: boolean;
};

export type Mood = 'great' | 'bad' | 'neutral';

export type EntryType = 'notes' | 'pictures' | 'links' | 'songs' | 'books';

export type Day = {
  mood?: Mood;
  collapsed?: boolean;
  notes?: { [id: string]: Note };
  links?: { [id: string]: Link };
  songs?: { [id: string]: Song };
  pictures?: { [id: string]: Picture };
  books?: { [id: string]: Book };
};

export type DateTimestampMMDDYYYY = `${number}/${number}/${number}`;

export type TimelineData = Map<DateTimestampMMDDYYYY, Day>;

export const TimelineStore = createContext<WritableAtom<TimelineData>>(null);

// Returns the timestamp for the start of a given day.
export const dateToEpoch = (date: Date) => {
  date.setHours(0, 0, 0, 0);
  return date;
};

const getDateTimestampMMDDYYYY = (date: Date): DateTimestampMMDDYYYY =>
  `${dateToEpoch(date).getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

export const mapReplacer = (_key, value: unknown) => {
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

const getPersistedState = () => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const localStorageState = window.localStorage.getItem('note_state');

    const parsed = JSON.parse(localStorageState, mapReviver);
    if (!(parsed instanceof Map)) {
      throw 'Invalid data type';
    }
    return parsed;
  } catch {
    console.log('Problem parsing localStorage state');
  }
};

export const getInitialTimelineState = () => {
  return (
    getPersistedState() ??
    new Map([
      [
        getDateTimestampMMDDYYYY(new Date(Date.now())),
        {
          notes: {},
          books: {},
          links: {},
          pictures: {},
          songs: {},
          mood: 'neutral' as Mood,
        } as Day,
      ],
    ])
  );
};

export const sharedTimelineState = atom<TimelineData>(
  getInitialTimelineState(),
);

export const getDaysIncludingFirstEntry = (timeline: TimelineData) => {
  const persistedDays = Array.from(timeline.keys());
  const storedDayTimestamps = Array.from(persistedDays)
    .map((d) => Date.parse(d))
    .sort((a, b) => a - b);
  const firstDay = new Date(storedDayTimestamps[0]);

  // Difference in days between the first day and the current day - so we can
  // show days from the current day back to the first day we have data for.
  const dayDiff = [];
  for (let i = firstDay; i < new Date(); i.setDate(i.getDate() + 1)) {
    dayDiff.push(getDateTimestampMMDDYYYY(i));
  }

  return dayDiff.reverse().map((d) => getDateTimestampMMDDYYYY(new Date(d)));
};

// Mega massive hook, but it's a good enough solution for now :-)
export const useTimelineState = (timestampIndex: DateTimestampMMDDYYYY) => {
  const timelineState = useContext(TimelineStore);
  const timeline = timelineState.get();
  const setTimeline = timelineState.set;

  const day = timeline.get(timestampIndex);

  const notes = useMemo(
    () => (day?.notes ? Object.entries(day.notes) : []),
    [day],
  );
  const songs = useMemo(
    () => (day?.songs ? Object.entries(day.songs) : []),
    [day],
  );
  const pictures = useMemo(
    () => (day?.pictures ? Object.entries(day.pictures) : []),
    [day],
  );
  const books = useMemo(
    () => (day?.books ? Object.entries(day.books) : []),
    [day],
  );
  const links = useMemo(
    () => (day?.links ? Object.entries(day.links) : []),
    [day],
  );

  const setDayCollapsed = useCallback(
    (isCollapsed: boolean) => {
      setTimeline(
        new Map(
          timeline.set(timestampIndex, {
            ...day,
            collapsed: isCollapsed,
          }),
        ),
      );
    },
    [timestampIndex, day, setTimeline, timeline],
  );

  const hasContent = useMemo(() => {
    return (
      notes.length > 0 ||
      songs.length > 0 ||
      pictures.length > 0 ||
      books.length > 0 ||
      links.length > 0
    );
  }, [notes, songs, pictures, books, links]);

  const addEntry = useCallback(
    (type: EntryType) => {
      if (day === undefined) {
        timeline.set(timestampIndex, {});
      }
      const entries = day?.[type];
      const entryId = crypto.randomUUID();
      setTimeline(
        new Map(
          timeline.set(timestampIndex, {
            ...day,
            // We'd like to uncollapse the day, because we're adding a new thing.
            collapsed: false,
            [type]: {
              ...entries,
              [entryId]: { complete: false },
            },
          }),
        ),
      );
    },
    [day, setTimeline, timeline, timestampIndex],
  );

  const updateNoteContent = useCallback(
    (newContent: string, noteId: string) => {
      const updatedNote = { ...day.notes[noteId], content: newContent };
      setTimeline(
        new Map(
          timeline.set(timestampIndex, {
            ...day,
            notes: { ...day.notes, [noteId]: updatedNote },
          }),
        ),
      );
    },
    [timestampIndex, day, setTimeline, timeline],
  );

  const setNoteCompletion = useCallback(
    (complete: boolean, noteId: string) => {
      const note = day.notes[noteId];
      const completedNote = { ...note, complete };
      setTimeline(
        new Map(
          timeline.set(timestampIndex, {
            ...day,
            notes: { ...day.notes, [noteId]: completedNote },
          }),
        ),
      );
    },
    [timestampIndex, day, setTimeline, timeline],
  );

  const removeNote = useCallback(
    (noteId: string) => {
      // Filter the note out of the id list.
      const filteredIds = Object.keys(day.notes).filter(
        (currentNoteId) => currentNoteId !== noteId,
      );

      // Construct a new object with the remaining ids.
      const finalNotes = Object.fromEntries(
        filteredIds.map((currentNoteId) => [
          currentNoteId,
          day.notes[currentNoteId],
        ]),
      );

      setTimeline(
        new Map(
          timeline.set(timestampIndex, {
            ...day,
            notes: finalNotes,
          }),
        ),
      );
    },
    [day, setTimeline, timeline, timestampIndex],
  );

  return {
    mutations: {
      setDayCollapsed,
      addEntry,
      updateNoteContent,
      removeNote,
      setNoteCompletion,
    },
    helpers: { hasContent },
    state: { day, notes, songs, pictures, books, links },
  };
};
