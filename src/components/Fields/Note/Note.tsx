import { FunctionComponent } from 'preact';
import { useContext, useCallback, useState } from 'preact/hooks';
import { TimelineStore } from '../../../lib/timelineStore';
import './Note.scss';

type NoteProps = {
  id: string;
  date: number;
  title?: string;
  content?: string;
};

const Note: FunctionComponent<NoteProps> = ({ content, id, date }) => {
  const [timeline, setTimeline] = useContext(TimelineStore);
  const day = timeline.get(date);
  const isCompleted = day?.notes[id]?.complete;

  const updateNoteContent = useCallback(
    (newContent: string) => {
      const updatedNote = { ...day.notes[id], content: newContent };
      setTimeline(
        new Map(
          timeline.set(date, {
            ...day,
            notes: { ...day.notes, [id]: updatedNote },
          }),
        ),
      );
    },
    [date, day, id, setTimeline, timeline],
  );

  const setNoteCompletion = useCallback(
    (complete: boolean) => {
      const completedNote = { ...day.notes[id], complete };
      setTimeline(
        new Map(
          timeline.set(date, {
            ...day,
            notes: { ...day.notes, [id]: completedNote },
          }),
        ),
      );
    },
    [date, day, id, setTimeline, timeline],
  );

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
          ...day,
          notes: finalNotes,
        }),
      ),
    );
  }, [day, setTimeline, timeline, date, id]);

  if (isCompleted) {
    return (
      <section class="note">
        <p>{content}</p>
        <button
          class="edit"
          onClick={() => setNoteCompletion(false)}
        >
          <i class="fa-solid fa-pencil" />
        </button>
      </section>
    );
  }

  return (
    <section class="note">
      <textarea
        placeholder="Write in me!"
        value={content}
        onInput={(e) => updateNoteContent(e.target?.value)}
      />
      <button
        class="approve"
        onClick={() => setNoteCompletion(true)}
      >
        <i class="fa-solid fa-check" />
      </button>
      <button
        class="clear"
        onClick={removeNote}
      >
        <i class="fa-solid fa-close" />
      </button>
    </section>
  );
};

export default Note;
