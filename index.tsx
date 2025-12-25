import { CSSProperties, MouseEvent } from 'react';
import { MbscCalendarEventData, MbscEventList } from '@mobiscroll/react';

import {
  formatEventDate,
  getHour,
  getMinute,
  startDayOfWeek,
  addDays,
  subtractDays,
  addWeeks,
  formatAgendaDate
} from 'library/utils';

import styles from './style.module.scss';
import { ColorTheme, VARIANT } from 'shared/constant';
import { usePopup } from 'features/event-calendar/hooks';
import { getBackgroundColor } from 'features/school-calendar/utils/color';
import { getVariantColorFromTheme } from 'shared/util';
import { useTranslation } from '@essnextgen/ui-intl-kit';

type AgendaViewProps = {
  data: MbscEventList[];
  currentDate: Date;
  setSidePanel: (dt: boolean) => void;
  getEventFromAgendaView: (dt: any) => void;
  // onBtnPrintClick: any;
  // setOnBtnPrintClick: any;
};

type EventList = {
  nonAllDay: MbscCalendarEventData[];
};

const getEvents = (initDay: Date, data: MbscEventList[]) => {
  const allEvents: EventList = { nonAllDay: [] };
  data.forEach((day: MbscEventList) => {
    if (day.date.toString() === formatEventDate(initDay)) {
      day.events.forEach((event: MbscCalendarEventData) => {
        allEvents.nonAllDay.push(event);
      });
    }
  });
  return allEvents;
};
const getEventStyles = (event: any, t: any) => {
  let backgroundColor: string;
  let agendaTextColorClassName = styles.agendaViewTextColor;
  let agendaNonAllDayClassName = styles.agendaNonAllDay;
  let coverLabels;
  if (
    event.original.eventType === 'TTNTPer' ||
    event.original.eventType === 'AttendanceSession' ||
    (event?.original?.eventType === 'TTPeriod' &&
      event?.original?.grpExternalId ===
        '00000000-0000-0000-0000-000000000000' &&
      (event?.original?.grpDesc !== '' || event?.grpDesc !== null))
  ) {
    backgroundColor = getVariantColorFromTheme({
      theme: ColorTheme.NEUTRAL,
      variant: VARIANT.VARIANT_200
    });
  } else {
    backgroundColor = getBackgroundColor(event.original, VARIANT.VARIANT_400);
    if (event.original.isCovered || event.original.isCovering) {
      backgroundColor = getVariantColorFromTheme({
        theme: event.original.isCovered
          ? ColorTheme.SUPPORTING_IMPROVEMENT
          : ColorTheme.PRIMARY,
        variant: VARIANT.VARIANT_900
      });
      agendaTextColorClassName = styles.agendaViewTextColorForCover;
      agendaNonAllDayClassName = styles.agendaNonAllDayForCover;
      if (event.original.isCovered) {
        coverLabels = t('lessonBlock.covered');
      } else if (event.original.isCovering) {
        coverLabels = t('lessonBlock.cover');
      }
    }
  }

  return {
    backgroundColor,
    agendaTextColorClassName,
    agendaNonAllDayClassName,
    coverLabels
  };
};

const AgendaEvent = ({
  event,
  setSidePanel,
  getEventFromAgendaView,
  onEventClick,
  t
}: any) => {
  const {
    backgroundColor,
    agendaTextColorClassName,
    agendaNonAllDayClassName,
    coverLabels
  } = getEventStyles(event, t);

  const handleClick = (domEvent: MouseEvent<HTMLDivElement>) => {
    if (
      event?.original?.grpExternalId === '00000000-0000-0000-0000-000000000000'
    ) {
      return;
    }
    setSidePanel(true);
    getEventFromAgendaView(event.original);
    return onEventClick({ domEvent, event: event.original });
  };

  return (
    <div
      data-testid="agendaEvents"
      className={agendaNonAllDayClassName}
      key={event.id}
      onClick={handleClick}
    >
      <div className={styles.agendaNonAllDay__content}>
        <div
          data-testid="agendaColor"
          className={styles.agendaColor}
          style={{ '--background-color': backgroundColor } as CSSProperties}
        />
        <div data-testid="agendaTimeBox" className={styles.agendaTimeBox}>
          <div
            data-testid="agendaStartTime"
            className={`essui-global-typography-default-table-header ${styles.agendaTime} ${agendaTextColorClassName}`}
          >
            {getHour(event.startDate) + ':' + getMinute(event.startDate)}
          </div>
          <div
            data-testid="agendaEndTime"
            className={`essui-global-typography-default-table-header ${styles.agendaTime} ${agendaTextColorClassName}`}
          >
            {getHour(event.endDate) + ':' + getMinute(event.endDate)}
          </div>
        </div>
        <div
          data-testid="agendaNonAllDayEvents"
          className={styles.agendaEventGrpDescNRoomCode}
        >
          <div
            data-testid="agendaNonAllDayGrpDescLvlCode"
            className={`${styles.agendaEventGrpDesc} ${agendaTextColorClassName}`}
          >
            {event.original.title ||
              event.original.eventCategories.eventCategoryName}
          </div>
          <div
            data-testid="agendaNonAllDayRoomCode"
            className={`essui-global-typography-default-table-header ${styles.agendaEventRoomCode} ${agendaTextColorClassName}`}
          >
            {event?.original?.room?.name}
          </div>
        </div>
      </div>
      <div
        data-testid="agendacoverEvent"
        className={`essui-global-typography-default-small-bold ${styles.coverLabel}`}
      >
        {coverLabels}
      </div>
    </div>
  );
};
export const AgendaView = ({
  data,
  currentDate,
  setSidePanel,
  getEventFromAgendaView
}: AgendaViewProps) => {
  const { onEventClick } = usePopup({
    isAgendaView: true
  });
  const { t } = useTranslation();
  const createAgenda = (
    startDay: Date,
    endDay: Date,
    data: MbscEventList[],
    setSidePanel: any,
    getEventFromAgendaView: any,
    onEventClick: any,
    t: any
  ) => {
    const list = [];
    for (
      let initDay = startDay;
      initDay <= endDay;
      initDay = addDays(initDay, 1)
    ) {
      const sortedEvents = getEvents(initDay, data);
      list.push(
        <div className={styles.outercontent} key={initDay.toDateString()}>
          {sortedEvents.nonAllDay.length > 0 &&
            sortedEvents.nonAllDay.map((event: any) => (
              <AgendaEvent
                key={event.id}
                event={event}
                setSidePanel={setSidePanel}
                getEventFromAgendaView={getEventFromAgendaView}
                onEventClick={onEventClick}
                t={t}
              />
            ))}
        </div>
      );
    }
    return list;
  };

  const renderAgenda = () => {
    const startDay = addDays(startDayOfWeek(currentDate), 1);
    const endDay = subtractDays(addWeeks(startDay, 1), 1);
    return (
      <div data-testid="customEventList" className="custom-event-list">
        <div
          data-testid="format-current-date"
          className={`${styles.formatCurrentDate} ${styles.agendaHeader}`}
        >
          <div
            className={styles.formatCurrentDate__content}
            data-testid="formatted-current-date"
          >
            {formatAgendaDate(currentDate, true)}
          </div>
        </div>
        {createAgenda(
          startDay,
          endDay,
          data,
          setSidePanel,
          getEventFromAgendaView,
          onEventClick,
          t
        )}
      </div>
    );
  };

  return renderAgenda();
};
