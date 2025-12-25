import { CSSProperties } from 'react';
import {
  EventCalendarParam,
  EventCalendarParamFunc,
  ISetDayRange,
  TablistParam,
  ViewType,
  renderEventCalendarProps
} from './model';
import {
  getStartAndEndDayTime,
  getHour,
  getMinute,
  subtractDays,
  addDays
} from '../../library/utils';
import {
  Eventcalendar,
  MbscCalendarEvent,
  MbscCalendarEventData,
  MbscEventcalendarOptions,
  formatDate
} from '@mobiscroll/react';
import styles from './style.module.scss';
import './mobiscroll-override.scss';
import './style.override.scss';
import { getVariantColorFromTheme } from 'shared/util';
import { ColorTheme, VARIANT } from 'shared/constant';
import { Loader, LoaderType, TabGroup } from '@essnextgen/ui-kit';
import { Timetable } from 'shared/types/staffTimetable';
import dayjs from 'dayjs';

import { myLocale } from '../../locales/cy/cy';
import { format } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import cy from 'date-fns/locale/cy';
import { EventAgendaView } from './utils/types/timetable-view';
import { getBackgroundColor } from './utils/color';
import { setAddEditSidePanelOpen } from '../../redux/slices/manageEventSlice';
import { setIntialDateTime } from './AddEditSchoolEvent/AddEditSchoolEventUtils';

export const renderContent = (isLoader: boolean) => {
  if (isLoader) {
    return (
      <div className="loaderContainer">
        <Loader loaderText="Please wait..." loaderType={LoaderType.Circular} />
      </div>
    );
  }
};

//Staff timetable tab remove from tab list
export const removeTab = (
  calendar: any,
  isCloseTab: boolean,
  calendarList: Timetable[],
  activeCalendarId: any,
  setSelectedActiveTab: (data: string) => void,
  setTimeTableList: (data: Timetable[]) => void,
  setIsLoader: (data: boolean) => void
) => {
  isCloseTab = true;
  setTimeTableList(
    calendarList.map(item =>
      item.externalId === calendar.externalId
        ? { ...item, checked: false }
        : item
    )
  );
  if (activeCalendarId === calendar.externalId) {
    const index = calendarList
      .filter(x => x.checked === true)
      .findIndex(item => item.externalId === calendar.externalId);
    if (calendarList.filter(x => x.checked === true).length === index + 1) {
      setSelectedActiveTab(
        calendarList.filter(x => x.checked === true)[index - 1]?.externalId
      );
      setIsLoader(true);
    } else {
      setSelectedActiveTab(
        calendarList.filter(x => x.checked === true)[index + 1]?.externalId
      );
      setIsLoader(true);
    }
  }
};

//Return staff timetable tab list with tooltip
export const returnTabList = ({}: TablistParam) => {
  return (
    <>
      <TabGroup dataTestId="TabGroup">{}</TabGroup>
    </>
  );
};
//Display the event data into the timetable page.
export const returnEvents = (data: MbscCalendarEventData) => {
  const original = data.original!;

  const displayEventTitle = (() => {
    const title = (data.original?.title || '').trim();
    return title ? title : data.original?.eventCategories?.eventCategoryName;
  })();

  let backgroundColor: string;
  if (
    data.original?.grpExternalId === '00000000-0000-0000-0000-000000000000' &&
    (data.original?.title !== '' || original?.title !== null)
  ) {
    backgroundColor = getVariantColorFromTheme({
      theme: ColorTheme.NEUTRAL,
      variant: VARIANT.VARIANT_200
    });
  } else {
    backgroundColor = getBackgroundColor(original, VARIANT.VARIANT_400);
  }
  return (
    <div className={styles.agendaNonAllDay}>
      <div className={styles.agendaNonAllDay__content}>
        {
          <div
            data-testid="agendaColor"
            className={styles.agendaColor}
            style={
              {
                '--background-color': backgroundColor
              } as CSSProperties
            }
          ></div>
        }
        {
          <div data-testid="agendaTimeBox" className={styles.agendaTimeBox}>
            <div
              data-testid="agendaStartTime"
              className={`essui-global-typography-default-table-header ${styles.agendaTime}`}
            >
              {getHour(data.startDate) + ':' + getMinute(data.startDate)}
            </div>
            <div
              data-testid="agendaEndTime"
              className={`essui-global-typography-default-table-header ${styles.agendaTime}`}
            >
              {getHour(data.endDate) + ':' + getMinute(data.endDate)}
            </div>
          </div>
        }
        {
          <div
            data-testid="agendaNonAllDayEvents"
            className={styles.agendaEventGrpDescNRoomCode}
          >
            <div
              data-testid="agendaNonAllDayEventsDesc"
              className={styles.agendaEventGrpDesc}
            >
              {displayEventTitle}
            </div>
            <div
              data-testid="agendaNonAllDayEventsDesc"
              className={`essui-global-typography-default-table-header ${styles.agendaEventRoomCode}`}
            >
              {original?.room?.name}
            </div>
          </div>
        }
      </div>
    </div>
  );
};
// month view component
export const eventCalendarFunc = ({
  commonCalendarProps,
  isMobileView,
  setCurrentDate,
  setShowSelectedDateRange,
  view,
  weekDetails,
  t,
  language,
  setEvents,
  events,
  eventFormData,
  dispatch
}: EventCalendarParamFunc) => {
  const local = language === 'cy' ? cy : enUS;

  const createEventFunction = (args: any) => {
    setEvents([...events]);
    const startDate: Date = args?.event?.start;
    if (startDate) {
      setIntialDateTime(
        startDate.getDate(),
        startDate.getMonth() + 1,
        startDate.getFullYear(),
        startDate.getHours(),
        startDate.getMinutes(),
        eventFormData,
        dispatch
      );
    }
    dispatch(setAddEditSidePanelOpen(true));
  };
  return (
    <>
      {weekDetails && view !== ViewType.Month && (
        <div>
          <div className={styles.customtitle}>Timetable week {weekDetails}</div>
        </div>
      )}
      <Eventcalendar
        locale={language === 'cy' ? myLocale : undefined}
        {...commonCalendarProps}
        cssClass={`index-route-css-calender ${
          view === ViewType.Month ? 'staff-timetable-month-view' : null
        }
        ${
          view === ViewType.MonthAgenda
            ? 'staff-timetable-month-agenda-view'
            : null
        }
              ${
                view === ViewType.WeekAgenda
                  ? 'staff-timetable-week-agenda-view'
                  : null
              }
              `}
        onCellClick={(e: any) => {
          e?.event && e?.event?.preventDefault();
          setCurrentDate({ date: e.date });
          isMobileView
            ? setShowSelectedDateRange(
                format(new Date(e.date), 'MMM yyyy', { locale: local })
              )
            : setShowSelectedDateRange(
                format(new Date(e.date), 'MMMM yyyy', { locale: local })
              );
        }}
        moreEventsText={t('landingPageMonthView.linkText')}
        onEventCreated={createEventFunction}
        clickToCreate={true}
      />
    </>
  );
};
// Return Event Calendar with timetable data.
export const eventCalendar = ({
  commonCalendarProps,
  isMobileView,
  setCurrentDate,
  setShowSelectedDateRange,
  view,
  weekDetails,
  customiseViewData,
  t,
  language,
  setEvents,
  events,
  eventFormData,
  dispatch
}: EventCalendarParam) => {
  if (
    customiseViewData &&
    (view === ViewType.Week ||
      view === ViewType.WorkingWeek ||
      view === ViewType.Day)
  ) {
    let viewType = commonCalendarProps.view;
    commonCalendarProps = {
      locale: language === 'cy' ? myLocale : undefined,
      ...commonCalendarProps,
      view: {
        schedule: {
          allDay: true,
          type: viewType?.schedule?.type,
          startTime: customiseViewData?.startTime,
          endTime: customiseViewData?.endTime,
          startDay:
            view === ViewType.WorkingWeek
              ? customiseViewData?.workingWeekStartDay
              : viewType?.schedule?.startDay,
          endDay:
            view === ViewType.WorkingWeek
              ? customiseViewData?.workingWeekEndDay
              : viewType?.schedule?.endDay,
          timeCellStep: customiseViewData?.timeScale,
          currentTimeIndicator: true,
          timeLabelStep: customiseViewData?.timeScale
        }
      }
    };
  }
  return eventCalendarFunc({
    commonCalendarProps,
    isMobileView,
    setCurrentDate,
    setShowSelectedDateRange,
    view,
    weekDetails,
    t,
    language,
    setEvents,
    events,
    eventFormData,
    dispatch
  });
  // return (
  //   <>
  //     {hasFeaturePermission('StaffTimetableMultiWeekLabel') &&
  //       weekDetails &&
  //       view !== ViewType.Month && (
  //         <div>
  //           <div className={styles.customtitle}>
  //             Timetable week {weekDetails}
  //           </div>
  //         </div>
  //       )}
  //     <Eventcalendar
  //       locale={language === 'cy' ? myLocale : ''}
  //       {...commonCalendarProps}
  //       cssClass={`index-route-css-calender ${
  //         view === ViewType.Month ? 'staff-timetable-month-view' : null
  //       }
  //       ${
  //         view === ViewType.MonthAgenda
  //           ? 'staff-timetable-month-agenda-view'
  //           : null
  //       }
  //             ${
  //               view === ViewType.WeekAgenda
  //                 ? 'staff-timetable-week-agenda-view'
  //                 : null
  //             }
  //             `}
  //       onCellClick={(e: any) => {
  //         setCurrentDate({ date: e.date });
  //         isMobileView
  //           ? setShowSelectedDateRange(
  //               format(new Date(e.date), 'MMM yyyy', { locale: local })
  //             )
  //           : setShowSelectedDateRange(
  //               format(new Date(e.date), 'MMMM yyyy', { locale: local })
  //             );
  //       }}
  //       moreEventsText={t('landingPageMonthView.linkText')}
  //     />
  //   </>
  // );
};

// Click operation on timetable events.
export const eventClick = (
  e: any,
  {
    setSidePanel,
    setSidePanelData
  }: {
    setSidePanel: (data: boolean) => void;
    setSidePanelData: (data: MbscCalendarEvent | null) => void;
  }
) => {
  moreInfoFormat(e.event, setSidePanelData);
  setSidePanel(true);
};

export const moreInfoFormat = (
  e: any,
  setSidePanelData: (data: MbscCalendarEvent | null) => void
) => {
  e.day = dayjs(e.start).format('dddd');
  e.starttime = dayjs(e.start).format('HH:mm');
  e.endtime = dayjs(e.originalEnd).format('HH:mm');
  e.eventPeriodNum = e.eventDesc || '';
  setSidePanelData(e);
};

// Today date celle color in timetable page.
export const todaysDateCellColor = getVariantColorFromTheme({
  theme: ColorTheme.PRIMARY,
  variant: VARIANT.VARIANT_50
});

// View render as per the device.
export const setDeviceView = (
  isLargeDesktopView: boolean,
  isSmallDesktopView: boolean,
  isTabletView: boolean,
  isMobileView: boolean
) => {
  if (isLargeDesktopView && isSmallDesktopView) {
    isSmallDesktopView = false;
  }
  if (isSmallDesktopView && isTabletView) {
    isTabletView = false;
  }
  if (isTabletView && isMobileView) {
    isMobileView = false;
  }
};
// set Date range for device.
export const setDataRange = ({
  setStartDateRange,
  setEndDateRange,
  currentDate,
  view,
  setShowSelectedDateRange,
  isMobileView,
  language,
  dayRequire
}: ISetDayRange) => {
  const local = language === 'cy' ? cy : enUS;

  setStartDateRange(
    formatDate('MM/DD/YYYY', subtractDays(currentDate, dayRequire))
  );
  setEndDateRange(formatDate('MM/DD/YYYY', addDays(currentDate, dayRequire)));

  /* If currentDate is changed but old and new dates are on the same calendar view,
           onEventCalendarDateChange doesn't fire to update the date range header in month view.
           Adding below logic correctly updates the date range */

  if (view === ViewType.Month || view === ViewType.MonthAgenda) {
    setShowSelectedDateRange(
      isMobileView
        ? format(new Date(currentDate), 'MMM yyyy', { locale: local })
        : format(new Date(currentDate), 'MMMM yyyy', { locale: local })
    );
  }
};

export const getEventAgendaView = ({
  event,
  setSidePanel,
  setSidePanelData
}: EventAgendaView) => {
  if (event) {
    setSidePanel(true);
    moreInfoFormat(event, setSidePanelData);
  } else {
    setSidePanel(false);
  }
};

export const rendarEventCalendar = (
  {
    isMobileView,
    setCurrentDate,
    setShowSelectedDateRange,
    view,
    weekDetails,
    customiseViewData,
    loggedInUserExternalId,
    reMount,
    isLoader,
    events,
    calendarView,
    renderAgenda,
    renderEvent,
    onEventCalendarDateChange,
    currentDate,
    renderScheduleEvent,
    renderLabel,
    onEventClick,
    setEvents,
    dispatch,
    eventFormData
  }: renderEventCalendarProps,
  t: any,
  language: any
) => {
  let commonCalendarProps: MbscEventcalendarOptions = {};

  if (events) {
    const [todaystartDayTime, todayEndDayTime] = getStartAndEndDayTime();
    commonCalendarProps = {
      locale: language === 'cy' ? myLocale : undefined,
      theme: 'ios',
      themeVariant: 'light',
      //ref: ref,
      renderHeader: () => null,
      clickToCreate: false,
      dragToMove: false,
      dragToResize: false,
      eventDelete: true,
      cssClass: 'index-route-css-calender',
      data: events,
      view: calendarView,
      renderAgenda: renderAgenda,
      renderEvent: renderEvent,
      firstDay: 0,
      onPageLoading: onEventCalendarDateChange,
      onPageChange: onEventCalendarDateChange,
      selectedDate: currentDate,
      timeFormat: 'HH:mm',
      // allDayText: 'All day',
      showEventTooltip: true,

      renderScheduleEvent: renderScheduleEvent,
      colors: [
        {
          start: todaystartDayTime,
          end: todayEndDayTime,
          background:
            view === ViewType.Month ? 'transparent' : todaysDateCellColor
        }
      ],
      renderLabel: renderLabel,
      onEventClick: onEventClick
    };
  }
  return reMount ? (
    isLoader ? (
      <div className={styles.loader_position}>{renderContent(isLoader)}</div>
    ) : (
      eventCalendar({
        commonCalendarProps: commonCalendarProps,
        isMobileView: isMobileView,
        setCurrentDate: setCurrentDate,
        setShowSelectedDateRange: setShowSelectedDateRange,
        view: view,
        weekDetails: weekDetails,
        customiseViewData: customiseViewData,
        loggedInUserExternalId: loggedInUserExternalId,
        t: t,
        language: language,
        setEvents: setEvents,
        events: events,
        eventFormData: eventFormData,
        dispatch
      })
    )
  ) : (
    <div data-testid="test-scheduler-loader" />
  );
};
