import { useCallback } from 'preact/hooks';
import { JSXInternal } from 'preact/src/jsx';
import { DateTimestamp, useTimelineState } from '../../../lib/timelineStore';
import '../Note.scss';

type NoteProps = {
  id: string;
  date: DateTimestamp;
  title?: string;
  content?: string;
};

const Note = ({ content, id, date }: NoteProps) => {
  const { state, mutations } = useTimelineState(date);
  const { day } = state;
  const { updateNote, setNoteCompletion, removeNote } = mutations;

  const note = day?.notes?.[id];
  const isCompleted = note?.complete ?? false;

  const updateNoteInput = useCallback(
    (e: JSXInternal.TargetedEvent<HTMLTextAreaElement, Event>) => {
      updateNote({ content: (e.target as HTMLTextAreaElement)?.value }, id);
    },
    [id, updateNote],
  );

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
          <section class="inputs">
            <textarea
              placeholder="Write in me!"
              value={content}
              onInput={updateNoteInput}
            />
          </section>
        )}

        <section class="buttons">
          {isCompleted && (
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
          )}
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
