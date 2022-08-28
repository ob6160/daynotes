import { FunctionComponent } from 'preact';
import { useCallback } from 'preact/hooks';
import { DateTimestamp, useTimelineState } from '../../../lib/timelineStore';
import './Note.scss';

type NoteProps = {
  id: string;
  date: DateTimestamp;
  title?: string;
  content?: string;
};

const Note: FunctionComponent<NoteProps> = ({ content, id, date }) => {
  const { state, mutations } = useTimelineState(date);
  const { day } = state;
  const { updateNoteContent, setNoteCompletion, removeNote } = mutations;

  const isCompleted = day?.notes[id]?.complete;

  const completeNoteIfPopulated = useCallback(() => {
    if (content) {
      setNoteCompletion(true, id);
    }
  }, [content, id, setNoteCompletion]);

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
            onClick={() => setNoteCompletion(false, id)}
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
                onClick={completeNoteIfPopulated}
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
