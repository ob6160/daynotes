import { FunctionComponent } from 'preact';
import { useCallback, useMemo } from 'preact/hooks';
import { DateTimestamp, useTimelineState } from '../../lib/timelineStore';
import Note from '../Fields/Note/Note';
import Title from './Title';
import styles from './Day.module.css';
import Song from '../Fields/Song/Song';
import Picture from '../Fields/Picture/Picture';
import Book from '../Fields/Book/Book';
import Link from '../Fields/Link/Link';

interface DayProps {
  date: DateTimestamp;
}

const Day: FunctionComponent<DayProps> = ({ date, children }) => {
  const { state, mutations, helpers } = useTimelineState(date);
  const { notes, songs, books, links, pictures, day } = state;
  const { hasContent } = helpers;
  const { addEntry } = mutations;

  const showContent = useMemo(() => !day?.collapsed, [day]);

  const addNote = useCallback(() => addEntry('notes'), [addEntry]);
  const addSong = useCallback(() => addEntry('songs'), [addEntry]);
  const addBook = useCallback(() => addEntry('books'), [addEntry]);
  const addPicture = useCallback(() => addEntry('pictures'), [addEntry]);
  const addLink = useCallback(() => addEntry('links'), [addEntry]);

  return (
    <li class={styles.dayListItem}>
      <section class={styles.dayContainer}>
        <Title
          date={date}
          hasContent={hasContent}
        />
        {showContent && (
          <section class={styles.content}>
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
        <section class={styles.controls}>
          <button
            class={styles.action}
            aria-label="Add a note"
            onClick={addNote}
          >
            <i
              aria-hidden="true"
              class="fa-solid fa-note-sticky"
            />
          </button>
          <button
            class={styles.action}
            aria-disabled="true"
            aria-label="Add a link"
            title="Disabled, not implemented yet"
            onClick={addLink}
          >
            <i
              aria-hidden="true"
              class="fa-solid fa-link"
            />
          </button>
          <button
            class={styles.action}
            aria-label="Add a picture"
            aria-disabled="true"
            disabled={true}
            title="Disabled, not implemented yet"
            onClick={addPicture}
          >
            <i
              aria-hidden="true"
              class="fa-solid fa-image"
            />
          </button>
          <button
            class={styles.action}
            aria-label="Add a book"
            aria-disabled="true"
            disabled={true}
            title="Disabled, not implemented yet"
            onClick={addBook}
          >
            <i
              aria-hidden="true"
              class="fa-solid fa-book"
            />
          </button>
          <button
            class={styles.action}
            aria-label="Add a song"
            aria-disabled="true"
            disabled={true}
            title="Disabled, not implemented yet"
            onClick={addSong}
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
