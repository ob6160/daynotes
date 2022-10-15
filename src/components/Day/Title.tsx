import { useMemo } from 'preact/hooks';
import { DateTimestamp, useTimelineState } from '../../lib/timelineStore';

import styles from './Title.module.css';

type TitleProps = {
  date: DateTimestamp;
  hasContent: boolean;
};

const Title = ({ date, hasContent }: TitleProps) => {
  const { state, mutations } = useTimelineState(date);
  const { setDayCollapsed } = mutations;
  const { day } = state;

  const isCollapsed = useMemo(() => day?.collapsed, [day]);

  const castedDate = new Date(date);
  const dayPart = castedDate.toLocaleString('en-gb', { weekday: 'long' });
  const monthPart = castedDate.toLocaleString('en-gb', {
    month: 'long',
    day: '2-digit',
  });
  const yearPart = castedDate.toLocaleString('en-gb', {
    year: 'numeric',
  });

  return (
    <section class={styles.title}>
      <section>
        <h2 class={styles.titleHeader}>{dayPart}</h2>
        <p class={styles.tagline}>{`${monthPart} ${yearPart}`}</p>
      </section>
      {hasContent && (
        <button
          class={`secondary ${styles.collapseButton}`}
          onClick={() => setDayCollapsed(!isCollapsed)}
          aria-label="Collapse the day content"
          aria-pressed={!isCollapsed}
        >
          {isCollapsed ? (
            <>
              <span>Show</span>
              <i
                aria-hidden="true"
                class="fa-solid fa-arrow-up"
              />
            </>
          ) : (
            <>
              <span>Hide</span>
              <i
                aria-hidden="true"
                class="fa-solid fa-arrow-down"
              />
            </>
          )}
        </button>
      )}
    </section>
  );
};

export default Title;
