import { FunctionComponent } from 'preact';
import { useCallback, useContext, useMemo } from 'preact/hooks';
import { TimelineStore } from '../../lib/timelineStore';
import './Day.scss';
import Note from './Note';
import Title from './Title';

interface DayProps {
  date: Date;
}

const Day: FunctionComponent<DayProps> = ({ date, children }) => {
  const [timeline, setTimeline] = useContext(TimelineStore);

  const day = timeline.get(date);
  const notes = useMemo(() => Object.entries(day?.notes), [day?.notes]);

  const addNote = useCallback(() => {
    setTimeline(
      new Map(
        timeline.set(date, {
          notes: { ...day.notes, [crypto.randomUUID()]: {} },
        }),
      ),
    );
  }, [setTimeline, timeline, date, day.notes]);

  return (
    <li class="day">
      <section>
        <Title date={date} />
        <section class="content">
          {notes.map(([id, props]) => (
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
            <i class="fa-solid fa-note-sticky" />
          </button>
          <button class="action">
            <i class="fa-solid fa-image" />
          </button>
          <button class="action">
            <i class="fa-solid fa-link" />
          </button>
          <button class="action">
            <i class="fa-solid fa-book" />
          </button>
          <button class="action">
            <i class="fa-solid fa-music" />
          </button>
        </section>
      </section>
    </li>
  );
};

export default Day;
