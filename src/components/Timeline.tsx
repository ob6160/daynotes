import 'preact/debug';
import { FunctionalComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import Day from './Day/Day';
import {
  Day as DayType,
  Mood,
  TimelineData,
  TimelineStore,
} from '../lib/timelineStore';
import './Timeline.scss';

const getPersistedState = () => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const localStorageState = window.localStorage.getItem('state');
    return JSON.parse(localStorageState, mapReviver);
  } catch {
    console.log('Problem parsing localStorage state');
  }
};

const mapReplacer = (key, value) => {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()),
    };
  }
  return value;
};

const mapReviver = (key, value) => {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
};

const Timeline: FunctionalComponent = () => {
  const initialTimelineState =
    getPersistedState() ??
    new Map([
      [
        new Date().valueOf(),
        {
          notes: {},
          books: {},
          links: {},
          pictures: {},
          songs: {},
          mood: 'neutral' as Mood,
        } as DayType,
      ],
    ]);

  const state = useState<TimelineData>(initialTimelineState);
  const dates = Array.from(state[0].keys());
  const timeline = dates.map((date) => (
    <Day
      key={date}
      date={date}
    />
  ));

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        'state',
        JSON.stringify(state[0], mapReplacer),
      );
    }
  }, [state]);

  return (
    <TimelineStore.Provider value={state}>
      <section class="timeline">
        <ul class="link-card-grid">{timeline}</ul>
      </section>
    </TimelineStore.Provider>
  );
};

export default Timeline;
