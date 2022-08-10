import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';
import { useTimelineState } from '../../lib/timelineStore';
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
  const { state, mutations, helpers } = useTimelineState(date);
  const { notes, songs, books, links, pictures, day } = state;
  const { hasContent } = helpers;
  const { addEntry } = mutations;

  const showContent = useMemo(() => !day?.collapsed, [day]);

  return (
    <li class="day">
      <section>
        <Title
          date={date}
          hasContent={hasContent}
        />
        {showContent && (
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
        )}
        <section class="controls">
          <button
            class="action"
            aria-label="Add a note"
            onClick={() => addEntry('notes')}
          >
            <i
              aria-hidden="true"
              class="fa-solid fa-note-sticky"
            />
          </button>
          <button
            class="action"
            aria-label="Add a picture"
            aria-disabled="true"
            disabled={true}
            title="Disabled, not implemnented yet"
            onClick={() => addEntry('pictures')}
          >
            <i
              aria-hidden="true"
              class="fa-solid fa-image"
            />
          </button>
          <button
            class="action"
            aria-disabled="true"
            disabled={true}
            aria-label="Add a link"
            title="Disabled, not implemnented yet"
            onClick={() => addEntry('links')}
          >
            <i
              aria-hidden="true"
              class="fa-solid fa-link"
            />
          </button>
          <button
            class="action"
            aria-label="Add a book"
            aria-disabled="true"
            disabled={true}
            title="Disabled, not implemnented yet"
            onClick={() => addEntry('books')}
          >
            <i
              aria-hidden="true"
              class="fa-solid fa-book"
            />
          </button>
          <button
            class="action"
            aria-label="Add a song"
            aria-disabled="true"
            disabled={true}
            title="Disabled, not implemnented yet"
            onClick={() => addEntry('songs')}
          >
            <i
              aria-hidden="true"
              class="fa-solid fa-music"
            />
          </button>
        </section>
      </section>
    </li>
  );
};

export default Day;
