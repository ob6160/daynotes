import 'preact/debug';
import { FunctionalComponent } from 'preact';
import { useState } from 'preact/hooks';
import Day from './Day/Day';
import { TimelineData, TimelineStore } from '../lib/timelineStore';
import './Timeline.scss';

const Timeline: FunctionalComponent = () => {
  const timelineContext = new Map([[new Date(), { notes: {} }]]);
  const state = useState<TimelineData>(timelineContext);
  const dates = Array.from(state[0].keys());
  const timeline = dates.map((date) => (
    <Day
      key={date}
      date={date}
    />
  ));

  return (
    <TimelineStore.Provider value={state}>
      <section class="timeline">
        <ul class="link-card-grid">{timeline}</ul>
      </section>
    </TimelineStore.Provider>
  );
};

export default Timeline;
