import { FunctionalComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import Day from './Day/Day';
import {
  getDaysIncludingFirstEntry,
  getInitialTimelineState,
  mapReplacer,
  TimelineData,
  TimelineStore,
} from '../lib/timelineStore';
import './Timeline.scss';

type TimelineProps = {
  backupMode?: boolean;
};

const Timeline: FunctionalComponent<TimelineProps> = () => {
  const state = useState<TimelineData>(getInitialTimelineState());
  const stateAsString = JSON.stringify(state[0], mapReplacer);

  // Fill in the gaps, so we render all the days — even if there are no entries.
  const daysToRender = getDaysIncludingFirstEntry(state[0]);

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
        window.localStorage.setItem('state', stateAsString);
      }
    },
    [state, stateAsString],
  );

  return (
    <TimelineStore.Provider value={state}>
      <section class="timeline">
        <ul class="link-card-grid">{timeline}</ul>
      </section>
    </TimelineStore.Provider>
  );
};

export default Timeline;
