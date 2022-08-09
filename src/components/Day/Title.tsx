import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';
import { useTimelineState } from '../../lib/timelineStore';

import './Title.scss';

type TitleProps = {
  date: number;
  hasContent: boolean;
};

const Title: FunctionComponent<TitleProps> = ({ date, hasContent }) => {
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
    <section class="title">
      <section>
        <h2>{dayPart}</h2>
        <p class="tagline">{`${monthPart} ${yearPart}`}</p>
      </section>
      {hasContent && (
        <button
          class="secondary collapse"
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
