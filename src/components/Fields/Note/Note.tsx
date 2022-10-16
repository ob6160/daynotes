import { useCallback } from 'preact/hooks';
import { JSXInternal } from 'preact/src/jsx';
import { DateTimestamp, useTimelineState } from '../../../lib/timelineStore';

import styles from '../Note.module.css';

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
    <section class={styles.note}>
      <section class={styles.editor}>
        {isCompleted ? (
          <section class={styles.finalContent}>
            <p>{content}</p>
          </section>
        ) : (
          <section class={styles.inputs}>
            <textarea
              placeholder="Write in me!"
              value={content}
              onInput={updateNoteInput}
            />
          </section>
        )}

        <section class={styles.buttons}>
          {isCompleted && (
            <button
              class={`secondary ${styles.edit}`}
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
                class={styles.approve}
                onClick={completeNoteIfPopulated}
                aria-label="Save your edits"
              >
                <i
                  aria-hidden="true"
                  class="fa-solid fa-check"
                />
              </button>
              <button
                class={styles.clear}
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
