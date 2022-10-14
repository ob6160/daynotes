import { action, actionFor, atom, WritableAtom } from 'nanostores';
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

type NoteTypes = Note | Picture | Link | Song | Book;

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

export type DateTimestamp = `${number}/${number}/${number}`;

export type TimelineData = Map<DateTimestamp, Day>;

export const TimelineStore = createContext<WritableAtom<TimelineData> | null>(
  null,
);

export const getTodayTimestamp = (): DateTimestamp =>
  getDateTimestamp(new Date(Date.now()));

const getDateTimestamp = (date: Date): DateTimestamp =>
  `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

export const mapReplacer = (_key: string, value: unknown) => {
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
export const mapReviver = (_key: string, value: any) => {
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
    const localStorageState = window.localStorage.getItem('note_state') ?? '';

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
        getDateTimestamp(new Date(Date.now())),
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

type CB = (store: WritableAtom<TimelineData>, add: TimelineData) => void;

export const updateTimelineState = action<WritableAtom<TimelineData>, CB>(
  sharedTimelineState,
  'updateTimelineState',
  async (store, newTimelineState) => {
    store.set(newTimelineState);
  },
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
    dayDiff.push(getDateTimestamp(i));
  }

  return dayDiff.reverse().map((d) => getDateTimestamp(new Date(d)));
};

// Mega massive hook, but it's a good enough solution for now :-)
export const useTimelineState = (timestampIndex: DateTimestamp) => {
  const timelineState = useContext(TimelineStore);

  if (timelineState === null) {
    console.error('TimelineStore context is not initialised');
    throw new Error('TimelineStore is null');
  }

  const timeline = timelineState.get();
  const setTimeline = timelineState.set;

  const day = useMemo(
    () => timeline.get(timestampIndex) ?? {},
    [timeline, timestampIndex],
  );

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
    (noteType: EntryType) => {
      if (day === undefined) {
        timeline.set(timestampIndex, {});
      }
      const entries = day[noteType];
      const entryId = crypto.randomUUID();
      setTimeline(
        new Map(
          timeline.set(timestampIndex, {
            ...day,
            // We'd like to un-collapse the day, because we're adding a new thing.
            collapsed: false,
            [noteType]: {
              ...entries,
              [entryId]: { complete: false },
            },
          }),
        ),
      );
    },
    [day, setTimeline, timeline, timestampIndex],
  );

  const updateNote = useCallback(
    (
      noteUpdate: Partial<NoteTypes>,
      noteId: string,
      noteType: EntryType = 'notes',
    ) => {
      console.log(noteUpdate, noteId, noteType);
      const notes = day[noteType] ?? {};
      const note = notes?.[noteId] ?? {};
      const updatedNote = { ...note, ...noteUpdate };
      setTimeline(
        new Map(
          timeline.set(timestampIndex, {
            ...day,
            [noteType]: { ...notes, [noteId]: updatedNote },
          }),
        ),
      );
    },
    [timestampIndex, day, setTimeline, timeline],
  );

  const setNoteCompletion = useCallback(
    (complete: boolean, noteId: string, noteType: EntryType = 'notes') => {
      const notes = day[noteType] ?? {};
      const note = notes?.[noteId] ?? {};
      const completedNote = { ...note, complete };
      setTimeline(
        new Map(
          timeline.set(timestampIndex, {
            ...day,
            [noteType]: { ...notes, [noteId]: completedNote },
          }),
        ),
      );
    },
    [timestampIndex, day, setTimeline, timeline],
  );

  const removeNote = useCallback(
    (noteId: string, noteType: EntryType = 'notes') => {
      const notes = day[noteType] ?? {};
      // Filter the note out of the id list.
      const filteredIds = Object.keys(notes).filter(
        (currentNoteId) => currentNoteId !== noteId,
      );

      // Construct a new object with the remaining ids.
      const finalNotes = Object.fromEntries(
        filteredIds.map((currentNoteId) => [
          currentNoteId,
          notes?.[currentNoteId],
        ]),
      );

      setTimeline(
        new Map(
          timeline.set(timestampIndex, {
            ...day,
            [noteType]: finalNotes,
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
      updateNote,
      removeNote,
      setNoteCompletion,
    },
    helpers: { hasContent },
    state: { day, notes, songs, pictures, books, links },
  };
};
