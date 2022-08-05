import { FunctionComponent } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import './Day.scss';

interface Props {
  date: Date;
}

const Title: FunctionComponent<{ date: Date }> = ({ date }) => {
  const dayPart = date.toLocaleString('en-gb', { weekday: 'long' });
  const monthPart = date.toLocaleString('en-gb', {
    month: 'long',
    day: '2-digit',
  });
  const yearPart = date.toLocaleString('en-gb', {
    year: 'numeric',
  });

  return (
    <section class="title">
      <section>
        <h2>{dayPart}</h2>
        <p class="tagline">{`${monthPart} ${yearPart}`}</p>
      </section>
    </section>
  );
};

type Note = {
  title?: string;
  content?: string;
};

const Note: FunctionComponent<Note> = ({ content }) => {
  return (
    <section class="note">
      <textarea
        placeholder="Write in me!"
        value={content}
      />
      <button class="clear">
        <i class="fa-solid fa-close"></i>
      </button>
    </section>
  );
};

const Day: FunctionComponent<Props> = ({ date, children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  // const [images, setImages] = useState([]);
  // const [links, setLinks] = useState([]);
  // const [books, setBooks] = useState([]);
  // const [music, setMusic] = useState([]);
  const addNote = useCallback(() => {
    setNotes([
      ...notes,
      {
        title: 'Test',
        content: 'test content...',
      },
    ]);
  }, [notes]);

  return (
    <li class="day">
      <section>
        <Title date={date} />
        <section class="content">
          {notes.map(({ title, content }) => (
            <Note
              title={title}
              content={content}
            />
          ))}
          {children}
        </section>
        <section class="controls">
          <button
            class="action"
            onClick={addNote}
          >
            <i class="fa-solid fa-note-sticky"></i>
          </button>
          <button class="action">
            <i class="fa-solid fa-image"></i>
          </button>
          <button class="action">
            <i class="fa-solid fa-link"></i>
          </button>
          <button class="action">
            <i class="fa-solid fa-book"></i>
          </button>
          <button class="action">
            <i class="fa-solid fa-music"></i>
          </button>
        </section>
      </section>
    </li>
  );
};

export default Day;
