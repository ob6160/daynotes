import { FunctionComponent } from 'preact';
import { useTimelineState } from '../../../lib/timelineStore';
import './Note.scss';

type NoteProps = {
  id: string;
  date: number;
  title?: string;
  content?: string;
};

const Note: FunctionComponent<NoteProps> = ({ content, id, date }) => {
  const { state, mutations } = useTimelineState(date);
  const { day } = state;
  const { updateNoteContent, setNoteCompletion, removeNote } = mutations;

  const isCompleted = day?.notes[id]?.complete;

  if (isCompleted) {
    return (
      <section class="note complete">
        <p>{content}</p>
        <button
          class="secondary edit"
          onClick={() => setNoteCompletion(false, id)}
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
        onInput={(e) => updateNoteContent(e.target?.value, id)}
      />
      <section class="buttons">
        <button
          class="approve"
          onClick={() => setNoteCompletion(true, id)}
        >
          <i class="fa-solid fa-check" />
        </button>
        <button
          class="clear"
          onClick={() => removeNote(id)}
        >
          <i class="fa-solid fa-trash" />
        </button>
      </section>
    </section>
  );
};

export default Note;
