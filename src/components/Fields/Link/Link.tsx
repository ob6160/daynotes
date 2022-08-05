import { FunctionComponent } from 'preact';
import { useContext, useCallback } from 'preact/hooks';
import { TimelineStore } from '../../../lib/timelineStore';
import './Note.scss';

type LinkProps = {
  id: string;
  date: Date;
  title?: string;
  url?: string;
};

const Link: FunctionComponent<LinkProps> = ({ url, id, date, title }) => {
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
          mood: day.mood,
          notes: finalNotes,
        }),
      ),
    );
  }, [day.notes, day.mood, setTimeline, timeline, date, id]);

  return (
    <section class="note">
      <input
        placeholder="Title"
        value={title}
      />
      <input
        placeholder="https://google.com/"
        value={url}
      />
      <button
        class="clear"
        onClick={removeNote}
      >
        <i class="fa-solid fa-close" />
      </button>
    </section>
  );
};

export default Link;
