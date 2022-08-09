import { createContext } from 'preact';
import { StateUpdater, useCallback, useContext, useMemo } from 'preact/hooks';

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

type DayTimestamp = number;

export type TimelineData = Map<DayTimestamp, Day>;

export const TimelineStore =
  createContext<[TimelineData, StateUpdater<TimelineData>]>(null);

// Mega massive hook, but it's a good enough solution for now :-)
export const useTimelineState = (date: number) => {
  const [timeline, setTimeline] = useContext(TimelineStore);
  const day = timeline.get(date);

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
          timeline.set(date, {
            ...day,
            collapsed: isCollapsed,
          }),
        ),
      );
    },
    [date, day, setTimeline, timeline],
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
        timeline.set(date, {});
      }

      const entries = day?.[type];
      const entryId = crypto.randomUUID();
      setTimeline(
        new Map(
          timeline.set(date, {
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
    [day, setTimeline, timeline, date],
  );

  const updateNoteContent = useCallback(
    (newContent: string, noteId: string) => {
      const updatedNote = { ...day.notes[noteId], content: newContent };
      setTimeline(
        new Map(
          timeline.set(date, {
            ...day,
            notes: { ...day.notes, [noteId]: updatedNote },
          }),
        ),
      );
    },
    [date, day, setTimeline, timeline],
  );

  const setNoteCompletion = useCallback(
    (complete: boolean, noteId: string) => {
      const completedNote = { ...day.notes[noteId], complete };
      setTimeline(
        new Map(
          timeline.set(date, {
            ...day,
            notes: { ...day.notes, [noteId]: completedNote },
          }),
        ),
      );
    },
    [date, day, setTimeline, timeline],
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
          timeline.set(date, {
            ...day,
            notes: finalNotes,
          }),
        ),
      );
    },
    [day, setTimeline, timeline, date],
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
