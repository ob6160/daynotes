import { useCallback } from 'preact/hooks';
import { JSXInternal } from 'preact/src/jsx';
import { DateTimestamp, useTimelineState } from '../../../lib/timelineStore';
import '../Note.scss';

type LinkProps = {
  id: string;
  date: DateTimestamp;
  title?: string;
  url?: string;
};

const Link = ({ url, id, date, title }: LinkProps) => {
  const { mutations, state } = useTimelineState(date);
  const { day } = state;
  const { removeNote, setNoteCompletion, updateNote } = mutations;

  const link = day?.links?.[id];
  const isCompleted = link?.complete ?? false;

  const updateLinkTitle = useCallback(
    (e: JSXInternal.TargetedEvent<HTMLInputElement, Event>) => {
      updateNote({ title: (e.target as HTMLInputElement)?.value }, id, 'links');
    },
    [id, updateNote],
  );

  const updateLinkUrl = useCallback(
    (e: JSXInternal.TargetedEvent<HTMLInputElement, Event>) => {
      // TODO: validate url.
      updateNote({ url: (e.target as HTMLInputElement)?.value }, id, 'links');
    },
    [id, updateNote],
  );

  const remove = useCallback(() => {
    removeNote(id, 'links');
  }, [id, removeNote]);

  const completeIfPopulated = useCallback(() => {
    if (title && url) {
      setNoteCompletion(true, id, 'links');
    }
  }, [id, setNoteCompletion, title, url]);

  const edit = useCallback(() => {
    setNoteCompletion(false, id, 'links');
  }, [id, setNoteCompletion]);

  return (
    <section class="note">
      <section class="editor">
        {isCompleted ? (
          <section class="final-content">
            <i
              aria-hidden="true"
              class="fa-solid fa-link"
            />
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {title}
            </a>
          </section>
        ) : (
          <section class="inputs">
            <label>
              Title
              <input
                placeholder="Title"
                onInput={updateLinkTitle}
                value={title}
              />
            </label>
            <label>
              Link
              <input
                type="url"
                placeholder="https://google.com/"
                onInput={updateLinkUrl}
                value={url}
              />
            </label>
          </section>
        )}

        <section class="buttons">
          {isCompleted && (
            <button
              class="secondary edit"
              onClick={edit}
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
                onClick={completeIfPopulated}
                aria-label="Save your edits"
              >
                <i
                  aria-hidden="true"
                  class="fa-solid fa-check"
                />
              </button>
              <button
                class="clear"
                onClick={remove}
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

export default Link;
