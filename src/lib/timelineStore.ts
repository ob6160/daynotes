import { createContext } from 'preact';
import { StateUpdater } from 'preact/hooks';

export type Note = {
  title?: string;
  content?: string;
};

export type Picture = {
  title?: string;
  url: string;
};

export type Link = {
  title?: string;
  url: string;
};

export type Song = {
  title: string;
  url: string;
};

export type Book = {
  title: string;
};

export type NoteVariants = Book | Song | Picture | Link | Note;

export type Moods = 'great' | 'bad' | 'neutral';

export type Day = {
  mood: Moods;
  notes: { [id: string]: NoteVariants };
};

export type TimelineData = Map<Date, Day>;

export const TimelineStore =
  createContext<[TimelineData, StateUpdater<TimelineData>]>(null);
