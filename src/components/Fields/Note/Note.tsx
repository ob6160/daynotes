import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';
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

  return (
    <section class="note">
      <section class="editor">
        {isCompleted ? (
          <p>{content}</p>
        ) : (
          <textarea
            placeholder="Write in me!"
            value={content}
            onInput={(e) => updateNoteContent(e.target?.value, id)}
          />
        )}

        <section class="buttons">
          <button
            class="secondary edit"
            onClick={() => setNoteCompletion(!isCompleted, id)}
            aria-label="Edit this note"
            aria-pressed={!isCompleted}
          >
            <i
              aria-hidden="true"
              class="fa-solid fa-pencil"
            />
          </button>
          {!isCompleted && (
            <>
              <button
                class="approve"
                onClick={() => setNoteCompletion(true, id)}
                aria-label="Save your edits"
              >
                <i
                  aria-hidden="true"
                  class="fa-solid fa-check"
                />
              </button>
              <button
                class="clear"
                onClick={() => removeNote(id)}
                aria-label="Delete this note"
              >
                <i
                  aria-hidden="true"
                  class="fa-solid fa-trash"
                />
              </button>
            </>
          )}
        </section>
      </section>
    </section>
  );
};

export default Note;
