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
  date: Date;
}

const Day: FunctionComponent<DayProps> = ({ date, children }) => {
  const [timeline, setTimeline] = useContext(TimelineStore);
  const day = timeline.get(date);

  const notes = useMemo(() => Object.entries(day?.notes), [day.notes]);
  const songs = useMemo(() => Object.entries(day?.songs), [day.songs]);
  const pictures = useMemo(() => Object.entries(day?.pictures), [day.pictures]);
  const books = useMemo(() => Object.entries(day?.books), [day.books]);
  const links = useMemo(() => Object.entries(day.links), [day.links]);

  const addEntry = useCallback(
    (type: EntryType) => {
      const entries = day?.[type];
      setTimeline(
        new Map(
          timeline.set(date, {
            ...day,
            [type]: {
              ...entries,
              [crypto.randomUUID()]: { date, complete: false },
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
              content={'test'}
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
