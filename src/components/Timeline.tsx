import Day from "./Day";
import "./Timeline.scss";

const getDaysArray = (start: Date, end: Date): Date[] => {
  const days: Date[] = [];
  for (
    let dt = new Date(end);
    dt >= new Date(start);
    dt.setDate(dt.getDate() - 1)
  ) {
    days.push(new Date(dt));
  }
  return days;
};

const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

const Timeline = () => {
  const sevenDaysAgo = new Date(Date.now() - sevenDaysInMs);
  const currentWeek = getDaysArray(sevenDaysAgo, new Date());

  return (
    <section class="timeline">
      <ul class="link-card-grid">
        {currentWeek.map((date) => {
          return <Day date={date}></Day>;
        })}
      </ul>
    </section>
  );
};
export default Timeline;
