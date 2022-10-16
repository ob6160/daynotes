import { useEffect } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import Day from './Day/Day';
import {
  getDaysIncludingFirstEntry,
  mapReplacer,
  sharedTimelineState,
  TimelineStore,
} from '../lib/timelineStore';

import styles from './Timeline.module.css';

const Timeline = () => {
  const $timelineState = useStore(sharedTimelineState);
  const stateAsString = JSON.stringify($timelineState, mapReplacer);

  // Fill in the gaps, so we render all the days — even if there are no entries.
  const daysToRender = getDaysIncludingFirstEntry($timelineState);

  const timeline = daysToRender.map((date) => (
    <Day
      key={date}
      date={date}
    />
  ));

  useEffect(
    // eslint-disable-next-line prefer-arrow-callback
    function updateStore() {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('note_state', stateAsString);
      }
    },
    [stateAsString],
  );

  return (
    <TimelineStore.Provider value={sharedTimelineState}>
      <section>
        <ul class={styles.linkDayCardGrid}>{timeline}</ul>
      </section>
    </TimelineStore.Provider>
  );
};

export default Timeline;
