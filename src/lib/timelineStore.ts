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

export type Mood = 'great' | 'bad' | 'neutral';

export type EntryType = 'notes' | 'pictures' | 'links' | 'songs' | 'books';

export type Day = {
  mood: Mood;
  notes: { [id: string]: Note };
  links: { [id: string]: Link };
  songs: { [id: string]: Song };
  pictures: { [id: string]: Picture };
  books: { [id: string]: Book };
};

export type TimelineData = Map<Date, Day>;

export const TimelineStore =
  createContext<[TimelineData, StateUpdater<TimelineData>]>(null);
