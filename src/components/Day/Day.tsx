import { FunctionComponent } from 'preact';
import { useCallback, useContext, useMemo } from 'preact/hooks';
import { EntryType, TimelineStore } from '../../lib/timelineStore';
import Note from '../Fields/Note/Note';
import Title from './Title';
import './Day.scss';
import Song from '../Fields/Song/Song';
import Picture from '../Fields/Picture/Picture';
import Book from '../Fields/Book/Book';
import Link from '../Fields/Link/Link';

interface DayProps {
  date: number;
}

const Day: FunctionComponent<DayProps> = ({ date, children }) => {
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
            [type]: {
              ...entries,
              [entryId]: { complete: false },
            },
          }),
        ),
      );
    },
    [setTimeline, timeline, date, day],
  );

  return (
    <li class="day">
      <section>
        <Title date={date} />
        <section class="content">
          {notes.map(([id, props]) => (
            <Note
              key={id}
              id={id}
              date={date}
              {...props}
            />
          ))}
          {songs.map(([id, props]) => (
            <Song
              key={id}
              {...props}
            />
          ))}
          {pictures.map(([id, props]) => (
            <Picture
              key={id}
              {...props}
            />
          ))}
          {books.map(([id, props]) => (
            <Book
              key={id}
              {...props}
            />
          ))}
          {links.map(([id, props]) => (
            <Link
              key={id}
              id={id}
              date={date}
              {...props}
            />
          ))}

          {children}
        </section>
        <section class="controls">
          <button
            class="action"
            onClick={() => addEntry('notes')}
          >
            <i class="fa-solid fa-note-sticky" />
          </button>
          <button
            class="action"
            onClick={() => addEntry('pictures')}
          >
            <i class="fa-solid fa-image" />
          </button>
          <button
            class="action"
            onClick={() => addEntry('links')}
          >
            <i class="fa-solid fa-link" />
          </button>
          <button
            class="action"
            onClick={() => addEntry('books')}
          >
            <i class="fa-solid fa-book" />
          </button>
          <button
            class="action"
            onClick={() => addEntry('songs')}
          >
            <i class="fa-solid fa-music" />
          </button>
        </section>
      </section>
    </li>
  );
};

export default Day;
