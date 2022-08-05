import { FunctionComponent } from 'preact';
import { useCallback, useContext, useEffect, useState } from 'preact/hooks';
import { Note, TimelineStore } from '../lib/timelineStore';
import './Day.scss';

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

type NoteProps = {
  id: string;
  date: Date;
  title?: string;
  content?: string;
};

const Note: FunctionComponent<NoteProps> = ({ content, id, date }) => {
  const [timeline, setTimeline] = useContext(TimelineStore);
  const day = timeline.get(date);

  const removeNote = useCallback(() => {
    // Filter the note out of the id list.
    const filteredIds = Object.keys(day.notes).filter(
      (noteId) => noteId !== id,
    );

    // Construct a new object with the remaining ids.
    const finalNotes = Object.fromEntries(
      filteredIds.map((noteId) => [noteId, day.notes[noteId]]),
    );

    setTimeline(
      new Map(
        timeline.set(date, {
          notes: finalNotes,
        }),
      ),
    );
  }, [day, setTimeline, id]);

  return (
    <section class="note">
      <textarea
        placeholder="Write in me!"
        value={content}
      />
      <button
        class="clear"
        onClick={removeNote}
      >
        <i class="fa-solid fa-close"></i>
      </button>
    </section>
  );
};

interface DayProps {
  date: Date;
}

const Day: FunctionComponent<DayProps> = ({ date, children }) => {
  const [timeline, setTimeline] = useContext(TimelineStore);

  const day = timeline.get(date);

  const addNote = useCallback(() => {
    setTimeline(
      new Map(
        timeline.set(date, {
          notes: { ...day.notes, [crypto.randomUUID()]: {} },
        }),
      ),
    );
  }, [timeline, setTimeline]);

  return (
    <li class="day">
      <section>
        <Title date={date} />
        <section class="content">
          {Object.entries(day?.notes).map(([id, props]) => (
            <Note
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
