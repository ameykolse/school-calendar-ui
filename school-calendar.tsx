import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { RightPaneHeader } from './components/right-pane-header';
import { SelectViewDropdown } from './components/select-view-dropdown';
import { ViewType, eventParams } from './model';
import { useHistory } from 'react-router-dom';
import { getFormattedRange, getView } from './utils';
import { useMediaQuery } from 'library/hooks';
import { useShowSelectedDateRange } from 'shared/hooks/use-show-selected-date-range';
import { gtmAnalytics, subtractDays, addDays } from 'library/utils';
import {
  MbscCalendarEvent,
  MbscCalendarEventData,
  MbscEventList,
  MbscPageChangeEvent,
  MbscPageLoadingEvent,
  formatDate
} from '@mobiscroll/react';
import styles from './style.module.scss';
import './mobiscroll-override.scss';
import './style.override.scss';
import { useIsMounted } from 'shared/hooks';
import { AgendaView } from './components/agenda-view';
import React from 'react';
import { AdditionalDetailsSidePanel } from './components/additional-details-panel/event-additional-details-panel.logic';
import { getUserExternalId } from './utils/auth-helper';
import { useTranslation } from '@essnextgen/ui-intl-kit';
import { StaffTimetableViewProps } from './utils/types/timetable-view';
import {
  eventClick,
  getEventAgendaView,
  rendarEventCalendar,
  returnEvents,
  returnTabList,
  setDataRange,
  setDeviceView
} from './school-calendar.view';
import { loadEventData } from './utils/types/schoolcalendarapi';
import AddEditSchoolEventLogic from './AddEditSchoolEvent/AddEditSchoolEventLogic';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/rootReducer';
import { Notification, NotificationStatus } from '@essnextgen/ui-kit';
import {
  resetAllStates,
  setSaveAPICall,
  setAddEditSidePanelOpen
} from '../../redux/slices/manageEventSlice';
import { IEventFormData } from './AddEditSchoolEvent/AddEditSchoolEventProps';
import { populateEventFormForEdit } from './AddEditSchoolEvent/AddEditSchoolEventUtils';

type eventsType = MbscCalendarEvent[] | null;
const startDatefunc = (currentDate: Date, dayRequire: number) => {
  return formatDate('MM/DD/YYYY', subtractDays(currentDate, dayRequire));
};

const endDatefunc = (currentDate: Date, dayRequire: number) => {
  return formatDate('MM/DD/YYYY', addDays(currentDate, dayRequire));
};

const startRangeFunc = () => {
  return ' ';
};

export const StaffTimetable = ({
  currentDate,
  setCurrentDate,
  view,
  setView,
  headerLeftNode,
  calendarList,
  setSelectedActiveTab,
  setTimeTableList,
  isLoader,
  setIsLoader,
  renderScheduleEvent,
  renderLabel,
  refreshCalendarForColorApply,
  customiseViewData,
  setDataStaffEventsSucc,
  setIsViewClicked
}: StaffTimetableViewProps) => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const history = useHistory() as { push: (url: string) => void };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [reMount, setReMount] = useState(true);

  const isLargeDesktopView = useMediaQuery('(min-width:1440px)');
  let isSmallDesktopView = useMediaQuery(
    '(min-width:1024px) and (max-width: 1440px)'
  );
  let isTabletView = useMediaQuery('(min-width:768px) and (max-width: 1024px)');
  let isMobileView = useMediaQuery('(min-width:350px) and (max-width: 768px)');
  setDeviceView(
    isLargeDesktopView,
    isSmallDesktopView,
    isTabletView,
    isMobileView
  );
  const [showSelectedDateRange, setShowSelectedDateRange] =
    useShowSelectedDateRange('');
  const [isSidePanel, setSidePanel] = useState(false);
  const [sidePanelData, setSidePanelData] = useState<MbscCalendarEvent | null>(
    null
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [errCodeMessage, setErrCodeMessage] = useState(false);
  const startDate = useRef<Date | null>(null);
  let isCloseTab = false;
  const endDate = useRef<Date | null>(null);
  const isMounted = useIsMounted();
  const [dayRequire, setDayRequire] = useState(6);
  const [startDateRange, setStartDateRange] = useState(
    startDatefunc(currentDate, dayRequire)
  );
  const [startRange, setStartRange] = useState(startRangeFunc);
  const [language, setLanguage] = useState(navigator.language);
  const [endDateRange, setEndDateRange] = useState(
    endDatefunc(currentDate, dayRequire)
  );
  const [events, setEvents] = useState<eventsType>(null);
  const [weekDetails, setWeekDetails] = useState<string | undefined>();
  const toggleSidePanelOpen = (isOpen: boolean) => {
    setSidePanel(isOpen);
  };
  const [currentDateUpdate, setCurrentDateUpdate] = useState(currentDate);
  const [loggedInUserExternalId] = useState(getUserExternalId());
  const { t } = useTranslation();
  const handleLanguageChange = () => {
    setLanguage(navigator.language);
  };

  const {
    isAddEditSidePanelOpen,
    saveAPICall,
    eventFormData
  }: {
    isAddEditSidePanelOpen: boolean;
    saveAPICall: {
      success: boolean;
      failure: boolean;
      loading: boolean;
    };
    eventFormData: IEventFormData;
  } = useSelector((state: RootState) => state.manageEvents);

  useEffect(() => {
    if (view === ViewType.Month || view === ViewType.MonthAgenda) {
      setDayRequire(30);
    } else {
      setDayRequire(6);
    }
  }, [view, dayRequire, setDayRequire]);
  useEffect(() => {
    dispatch(resetAllStates());
    window.addEventListener('languagechange', handleLanguageChange);
    return () => {
      window.removeEventListener('languagechange', handleLanguageChange);
    };
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    setStartRange(
      formatDate('MM/DD/YYYY', subtractDays(currentDate, dayRequire))
    );
  }, [currentDate, setStartRange, dayRequire]);
  useEffect(() => {
    if (currentDate === currentDateUpdate) {
      setCurrentDateUpdate(currentDate);
    }
  }, [currentDate, currentDateUpdate, showSelectedDateRange]);

  useEffect(() => {
    const eventParam: eventParams = {
      startDateRange: startDateRange,
      endDateRange: endDateRange,
      setEvents: setEvents,
      setIsLoader: setIsLoader,
      history: history,
      setWeekDetails: setWeekDetails,
      currentDate: currentDateUpdate,
      view: view,
      setDataStaffEventsSucc: setDataStaffEventsSucc
    };
    if (startRange === startDateRange || saveAPICall?.success) {
      return loadEventData(eventParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    setEvents,
    setIsLoader,
    startDateRange,
    endDateRange,
    history,
    calendarList,
    setTimeTableList,
    refreshCalendarForColorApply,
    currentDateUpdate,
    startRange,
    setDataStaffEventsSucc,
    saveAPICall?.success
  ]);

  useEffect(() => {
    setDataRange({
      setStartDateRange,
      setEndDateRange,
      currentDate: currentDateUpdate,
      view,
      setShowSelectedDateRange,
      isMobileView,
      language,
      dayRequire
    });
  }, [
    currentDateUpdate,
    view,
    setShowSelectedDateRange,
    setView,
    isMobileView,
    showSelectedDateRange,
    language,
    dayRequire
  ]);

  const changeView: (viewName: ViewType) => void = useCallback(
    async viewName => {
      if (view !== viewName) {
        setView(viewName);
        // Save the selected view to the backend
        localStorage.setItem('SchoolCalendarActiveTab', viewName);
        //await saveLastSelectedTab(viewName);
      }
    },
    [view, setView]
  );

  useEffect(() => {
    (async () => {
      //const lastView = await getLastSelectedTab(startDateRange, endDateRange);
      const lastView = localStorage.getItem('SchoolCalendarActiveTab');
      if (lastView) {
        // Normalize workingweek to workingWeek for ViewType
        let normalizedView = lastView;
        if (lastView.toLowerCase() === 'workingweek') {
          normalizedView = 'workingWeek';
        }
        setView(normalizedView as ViewType);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onEventCalendarDateChange: (
    args: MbscPageLoadingEvent | MbscPageChangeEvent
  ) => void = useCallback(
    args => {
      const { firstDay, lastDay } = args;
      const eDate = new Date(
        lastDay.getFullYear(),
        lastDay.getMonth(),
        lastDay.getDate() - 1,
        0
      );

      setTimeout(() => {
        startDate.current = firstDay;
        endDate.current = eDate;

        if (isMounted()) {
          setCurrentDateUpdate(currentDate);
          setShowSelectedDateRange(
            getFormattedRange(
              firstDay,
              eDate,
              view,
              currentDateUpdate,
              isMobileView,
              language
            )
          );
        }
      });
    },
    [
      language,
      isMounted,
      currentDate,
      setShowSelectedDateRange,
      view,
      currentDateUpdate,
      isMobileView
    ]
  );

  // Recreate calendar view whenever either view type or currentDate changes
  const calendarView = useMemo(
    () => getView(view, currentDate),
    [view, currentDate]
  );

  const getEventFromAgendaView = useCallback<(event: MbscCalendarEvent) => any>(
    (event: MbscCalendarEvent) => {
      getEventAgendaView({
        event,
        setSidePanel,
        setSidePanelData
      });
    },
    []
  );
  const renderAgenda = useCallback(
    (data: MbscEventList[]) => (
      <AgendaView
        data={data}
        currentDate={currentDate}
        setSidePanel={setSidePanel}
        getEventFromAgendaView={getEventFromAgendaView}
      />
    ),
    [currentDate, getEventFromAgendaView]
  );
  const renderEvent = useCallback<(data: MbscCalendarEventData) => any>(
    (data: MbscCalendarEventData) => {
      return returnEvents(data);
    },
    []
  );

  const onEventClick = React.useCallback((e: any) => {
    gtmAnalytics.pushEvent({
      event: 'interact_click',
      elementType: 'calendar_event',
      elementLocation: 'calendar'
    });
    eventClick(e, {
      setSidePanel,
      setSidePanelData
    });
  }, []);

  const handleEditEvent = (data: MbscCalendarEvent) => {
    populateEventFormForEdit(data, dispatch);
    setSidePanel(false);
    dispatch(setAddEditSidePanelOpen(true));
  };

  return (
    <>
      <div className={`${isTabletView ? styles.headerMargin : ''}`}>
        <RightPaneHeader
          headerLeftNode={headerLeftNode}
          selectViewDropdown={
            <SelectViewDropdown
              changeView={changeView}
              view={view}
              isTabletView={isTabletView}
              isMobileView={isMobileView}
              setIsViewClicked={setIsViewClicked}
            />
          }
          showSelectedDateRange={showSelectedDateRange}
          isMobileView={isMobileView}
          currentDateUpdate={currentDateUpdate}
          setCurrentDate={setCurrentDate}
          view={view}
        />
      </div>
      <AdditionalDetailsSidePanel
        isSidePanel={isSidePanel}
        toggleSidePanelOpen={toggleSidePanelOpen}
        sidePanelData={sidePanelData}
        calendarList={calendarList}
        errCodeMessage={errCodeMessage}
        handleEditEvent={handleEditEvent}
      />

      {isAddEditSidePanelOpen && <AddEditSchoolEventLogic />}

      {saveAPICall?.success && (
        <Notification
          status={NotificationStatus.SUCCESSTOAST}
          title={t('notifications.changesSaved')}
          onClickClose={() =>
            dispatch(
              setSaveAPICall({
                ...saveAPICall,
                success: false
              })
            )
          }
          autoclose
          onAutoClose={() => {
            setTimeout(() => {
              dispatch(
                setSaveAPICall({
                  ...saveAPICall,
                  success: false
                })
              );
            }, 150);
          }}
        />
      )}

      {returnTabList({
        isCloseTab: isCloseTab,
        calendarList: calendarList,
        setSelectedActiveTab: setSelectedActiveTab,
        setTimeTableList: setTimeTableList,
        setIsLoader: setIsLoader,
        isTabletView: isTabletView,
        isMobileView: isMobileView
      })}
      {rendarEventCalendar(
        {
          isMobileView: isMobileView,
          setCurrentDate: setCurrentDate,
          setShowSelectedDateRange: setShowSelectedDateRange,
          view: view,
          weekDetails: weekDetails,
          customiseViewData: customiseViewData,
          loggedInUserExternalId: loggedInUserExternalId,
          reMount: reMount,
          isLoader: isLoader,
          events: events,
          calendarView: calendarView,
          renderAgenda: renderAgenda,
          renderEvent: renderEvent,
          onEventCalendarDateChange: onEventCalendarDateChange,
          currentDate: currentDate,
          renderScheduleEvent: renderScheduleEvent,
          renderLabel: renderLabel,
          onEventClick: onEventClick,
          renderEventTooltip: () => null,
          setEvents: setEvents,
          dispatch: dispatch,
          eventFormData: eventFormData
        },
        t,
        language
      )}
    </>
  );
};
