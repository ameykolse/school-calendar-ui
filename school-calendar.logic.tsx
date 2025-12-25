import { StaffTimetable } from './school-calendar';
import { useCallback, useState } from 'react';
import { MbscCalendarEventData } from '@mobiscroll/react';
import { getVariantColorFromTheme } from 'shared/util';
import { ColorTheme, VARIANT } from 'shared/constant';
import './mobiscroll-override.scss';
import './style.override.scss';
import styles from './style.module.scss';
import { getBackgroundColor } from './utils/color';
import { addDays, getCurrentWeekRange } from 'library/utils';
import { getUserExternalId } from './utils/auth-helper';
import { useTranslation } from '@essnextgen/ui-intl-kit';
import { StaffTimetableProps } from './utils/types/timetable';
import { IScheduleEventProps } from './model';
import { Button, ButtonColor, ButtonSize } from '@essnextgen/ui-kit';
export const SchoolCalendarLogic = ({
  currentDate,
  setCurrentDate,
  view,
  setView,
  headerLeftNode,
  calendarList,
  activeCalendarId,
  setSelectedActiveTab,
  setTimeTableList,
  isLoader,
  setIsLoader,
  setName,
  refreshCalendarForColorApply,
  customiseViewData,
  setDataStaffEventsSucc,
  setIsViewClicked
}: StaffTimetableProps) => {
  const [loggedInUserExternalId] = useState(getUserExternalId());
  const { t } = useTranslation();

  const renderScheduleEvent = useCallback<(data: MbscCalendarEventData) => any>(
    (data: MbscCalendarEventData) => {
      const original = data.original!;
      const {
        backgroundColor,
        borderColor,
        coverLabelClassName,
        coverLabels,
        hoverColor,
        textColor,
        textColorClassName
      } = getColorDetails(original, t);
      return renderScheduleElement({
        borderColor,
        backgroundColor,
        textColor,
        hoverColor,
        original,
        textColorClassName,
        customiseViewData,
        loggedInUserExternalId,
        activeCalendarId,
        data,
        coverLabelClassName,
        coverLabels
      });
    },
    [customiseViewData, loggedInUserExternalId, activeCalendarId, t]
  );

  const renderLabel = useCallback<(data: MbscCalendarEventData) => any>(
    (data: MbscCalendarEventData) => {
      const original = data.original!;
      const displayEventTitle = (() => {
        const title = (data.original?.title || '').trim();
        return title
          ? title
          : data.original?.eventCategories?.eventCategoryName;
      })();

      if (original.allDay || original.isMultiDay) {
        let backgroundColor = getBackgroundColor(original, VARIANT.VARIANT_200);
        let hoverColor = getBackgroundColor(original, VARIANT.VARIANT_400);
        let outlineColor = backgroundColor;
        let customLabelClassName = styles.customLabel;
        return (
          <>
            <div
              onClick={() => handleColorChange(outlineColor)}
              onMouseDown={() => handleColorChange(outlineColor)}
              data-testid="labelEventOuterTT"
              className={`${styles.labelEventOuterDiv} ${styles.coverevent}`}
              style={
                {
                  '--bg-label-color': backgroundColor,
                  '--hover-label-color': hoverColor
                } as React.CSSProperties
              }
            >
              <div
                data-testid="labelEventContentTT"
                className={`${styles.labelEventContent}`}
              >
                <div
                  data-testid="labelEventColorTT"
                  className={`${styles.boxTTPer}`}
                  style={
                    {
                      '--bg-color': backgroundColor
                    } as React.CSSProperties
                  }
                ></div>
                <div
                  data-testid="labelEvntDescNTimeTT"
                  className={`essui-global-typography-default-small ${customLabelClassName} ${styles.labelEvntDescNTimeTT} ${styles.labelFontWeightBold}`}
                >
                  {displayEventTitle ||
                    data?.original?.eventCategories?.eventCategoryName}
                  <div>
                    {data?.original?.recurrence && (
                      <Button
                        size={ButtonSize.Small}
                        color={ButtonColor.Tertiary}
                        iconName="repeat"
                        className="repeat-button"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      } else {
        let backgroundColor = getBackgroundColor(original, VARIANT.VARIANT_400);
        let fillColor = 'transparent';
        let hoverColor = getBackgroundColor(original, VARIANT.VARIANT_300);
        let outlineColor = backgroundColor;
        let customLabelClassName = styles.customLabel;

        return (
          <>
            <div
              onClick={() => handleColorChange(outlineColor)}
              onMouseDown={() => handleColorChange(outlineColor)}
              data-testid="labelEventOuterTT"
              className={`${styles.labelEventOuterDiv} ${styles.coverevent}`}
              style={
                {
                  '--bg-label-color': fillColor,
                  '--hover-label-color': hoverColor
                } as React.CSSProperties
              }
            >
              <div
                data-testid="labelEventContentTT"
                className={`${styles.labelEventContent}`}
              >
                <div
                  data-testid="labelEventColorTT"
                  className={`${styles.boxTTPer}`}
                  style={
                    {
                      '--bg-color': backgroundColor
                    } as React.CSSProperties
                  }
                ></div>
                <div
                  data-testid="labelEvntDescNTimeTT"
                  className={`essui-global-typography-default-small ${customLabelClassName} ${styles.labelEvntDescNTimeTT} ${styles.labelFontWeight}`}
                >
                  {data.start}{' '}
                  <span className={styles.labelFontWeightBold}>
                    {displayEventTitle ||
                      original?.eventCategories?.eventCategoryName}
                  </span>
                  <div>
                    {data.original?.recurrence && (
                      <Button
                        size={ButtonSize.Small}
                        color={ButtonColor.Tertiary}
                        iconName="repeat"
                        className="repeat-button"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      }
    },
    []
  );

  return (
    <StaffTimetable
      currentDate={currentDate}
      setCurrentDate={setCurrentDate}
      setName={setName}
      view={view}
      setView={setView}
      calendarList={calendarList}
      setSelectedActiveTab={setSelectedActiveTab}
      setTimeTableList={setTimeTableList}
      isLoader={isLoader}
      setIsLoader={setIsLoader}
      headerLeftNode={headerLeftNode}
      renderScheduleEvent={renderScheduleEvent}
      renderLabel={renderLabel}
      refreshCalendarForColorApply={refreshCalendarForColorApply}
      customiseViewData={customiseViewData}
      setDataStaffEventsSucc={setDataStaffEventsSucc}
      setIsViewClicked={setIsViewClicked}
      isSameStaff={false}
      onPrintClick={undefined}
      onBtnPrintClick={undefined}
      setOnBtnPrintClick={undefined}
      printStaffName={''}
    />
  );
};
const handleColorChange = (outlineColor: string) => {
  document.documentElement.style.setProperty(
    '--event-outline-color',
    outlineColor
  );
};
export const getColorDetails = (original: any, t: any) => {
  let backgroundColor: string;
  let hoverColor: string;
  let borderColor: string;
  let textColorClassName = styles.eventTextColorBlack;
  let coverLabels;
  let coverLabelClassName;
  let textColor;
  let customLabelClassName;
  if (
    original?.grpExternalId === '00000000-0000-0000-0000-000000000000' &&
    (original?.grpDesc !== '' || original?.grpDesc !== null)
  ) {
    backgroundColor = getVariantColorFromTheme({
      theme: ColorTheme.NEUTRAL,
      variant: VARIANT.VARIANT_200
    });
    hoverColor = getVariantColorFromTheme({
      theme: ColorTheme.NEUTRAL,
      variant: VARIANT.VARIANT_300
    });
    borderColor = getVariantColorFromTheme({
      theme: ColorTheme.NEUTRAL,
      variant: VARIANT.VARIANT_400
    });
  } else {
    backgroundColor = getBackgroundColor(original);
    hoverColor = getBackgroundColor(original, VARIANT.VARIANT_300);
    borderColor = getBackgroundColor(original, VARIANT.VARIANT_400);
    if (original.isCovered || original.isCovering) {
      backgroundColor = getVariantColorFromTheme({
        theme: original.isCovered
          ? ColorTheme.SUPPORTING_IMPROVEMENT
          : ColorTheme.PRIMARY,
        variant: VARIANT.VARIANT_700
      });
      hoverColor = getVariantColorFromTheme({
        theme: original.isCovered
          ? ColorTheme.SUPPORTING_IMPROVEMENT
          : ColorTheme.PRIMARY,
        variant: VARIANT.VARIANT_800
      });
      borderColor = getVariantColorFromTheme({
        theme: original.isCovered
          ? ColorTheme.SUPPORTING_IMPROVEMENT
          : ColorTheme.PRIMARY,
        variant: VARIANT.VARIANT_900
      });
      textColor = getVariantColorFromTheme({
        theme: ColorTheme.NEUTRAL,
        variant: VARIANT.VARIANT_0
      });
      textColorClassName = styles.eventTextColorWhite;
      if (original.isCovered) {
        coverLabels = t('lessonBlock.covered');
        coverLabelClassName = styles.coveredLabel;
      } else if (original.isCovering) {
        coverLabels = t('lessonBlock.cover');
        coverLabelClassName = styles.coverLabel;
      }
    }
  }
  return {
    backgroundColor,
    hoverColor,
    customLabelClassName,
    borderColor,
    textColor,
    textColorClassName,
    coverLabels,
    coverLabelClassName
  };
};

export const setDataForStates = (
  eventData: any[],
  setEvents: (data: any) => void,
  setIsLoader: (data: boolean) => void,
  setWeekDetails: (data: string) => void,
  currentDate: Date,
  view: string
) => {
  setEvents(eventData);
  setIsLoader(false);
  let weekDetail = '';
  let i = 0;
  if (view === 'day') {
    while (weekDetail === '' && i <= 7) {
      if (i > 0 && view !== 'day') {
        currentDate = addDays(currentDate, 1);
      }
      weekDetail = getEventDetails(eventData, currentDate);
      i++;
    }
  }
  weekDetail = getEventDetails(eventData, currentDate);
  setWeekDetails(extractEventInfo(weekDetail));
};

const getEventDetails = (eventData: any[], currentDate: Date): string => {
  const { weekStartDate, weekEndDate } = getCurrentWeekRange(currentDate);

  const details =
    eventData?.find(
      x =>
        x.start.split('T')[0] >= weekStartDate.split('T')[0] &&
        x.start.split('T')[0] <= weekEndDate.split('T')[0]
    )?.originalEventDesc ?? '';

  return details;
};

const extractEventInfo = (eventDesc: string): string => {
  const weeks = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  let i = 0;
  while (i < weeks.length) {
    if (eventDesc && eventDesc.indexOf(weeks[i]) > -1) {
      return eventDesc.slice(0, eventDesc.indexOf(weeks[i]));
    }
    i++;
  }
  return '';
};

export const renderEventForDurationInMinSixty = (
  eventDurationInMin: any,
  customiseViewData: any,
  loggedInUserExternalId: string
) => {
  if (loggedInUserExternalId) {
    if (eventDurationInMin <= 15 && customiseViewData?.timeScale === 30) {
      return false;
    }
    return (
      eventDurationInMin >= 60 ||
      customiseViewData?.timeScale === 15 ||
      customiseViewData?.timeScale === 30
    );
  } else {
    return eventDurationInMin >= 60;
  }
};

export const renderEventForDurationInMinFourty = (
  eventDurationInMin: any,
  customiseViewData: any,
  loggedInUserExternalId: string
) => {
  if (loggedInUserExternalId) {
    if (eventDurationInMin <= 15 && customiseViewData?.timeScale === 30) {
      return false;
    }
    return (
      eventDurationInMin >= 40 ||
      customiseViewData?.timeScale === 15 ||
      customiseViewData?.timeScale === 30
    );
  } else {
    return eventDurationInMin >= 40;
  }
};

// const renderLabelForNonTTPeriod = (original: any) => {
//   const backgroundColor = getVariantColorFromTheme({
//     theme: ColorTheme.NEUTRAL,
//     variant: VARIANT.VARIANT_200
//   });
//   const hoverColor = getVariantColorFromTheme({
//     theme: ColorTheme.NEUTRAL,
//     variant: VARIANT.VARIANT_300
//   });
//   const outlineColor = getVariantColorFromTheme({
//     theme: ColorTheme.NEUTRAL,
//     variant: VARIANT.VARIANT_400
//   });
//   return (
//     <>
//       <div
//         onClick={() => handleColorChange(outlineColor)}
//         onMouseDown={() => handleColorChange(outlineColor)}
//         data-testid="labelEventOuterNTT"
//         className={`${styles.labelEventOuterDiv}`}
//         style={
//           {
//             '--bg-label-color': backgroundColor,
//             '--hover-label-color': hoverColor
//           } as React.CSSProperties
//         }
//       >
//         <div
//           data-testid="labelEventContentNTT"
//           className={`${styles.labelEventContent}`}
//         >
//           <div
//             data-testid="labelGrpDescLvlCodeNTT"
//             className={`essui-global-typography-default-small-bold ${styles.customLabelNTPer}`}
//           >
//             {original.grpDesc} {original.levelCode}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

const renderScheduleElement: ({}: IScheduleEventProps) => JSX.Element = ({
  borderColor,
  backgroundColor,
  textColor,
  hoverColor,
  original,
  textColorClassName,
  customiseViewData,
  loggedInUserExternalId,
  data,
  coverLabelClassName,
  coverLabels
}: IScheduleEventProps): JSX.Element => {
  const displayEventTitle = (() => {
    const title = (data.original?.title || '').trim();
    return title ? title : data.original?.eventCategories?.eventCategoryName;
  })();

  return (
    <div
      onClick={() => handleColorChange(borderColor)}
      onMouseDown={() => handleColorChange(borderColor)}
      data-testid="non-allDayEvent"
      className={styles.customEventCont}
      style={
        {
          '--bg-color': backgroundColor,
          '--border-color': borderColor,
          '--color': textColor,
          '--hover-color': hoverColor
        } as React.CSSProperties
      }
    >
      {/* For events less than and greater 18 min apply changes */}
      <div
        data-testid="non-allDayEventWrapper"
        className={`${styles.customEventWrapper} 
                    ${
                      original.eventDurationInMin >= 18
                        ? styles.marginForLongEvents
                        : styles.marginForShortEvents
                    }`}
      >
        <div
          data-testid="eventTitle"
          className={`${styles.customEventTitle} ${styles.eventTitleEllipsis} ${textColorClassName}`}
        >
          {displayEventTitle}
        </div>
        <>
          {renderEventForDurationInMinFourty(
            original?.eventDurationInMin,
            customiseViewData,
            loggedInUserExternalId
          ) && (
            <div
              data-testid="eventTime"
              className={`essui-global-typography-default-table-header ${styles.customEventTime} ${textColorClassName}
                    `}
            >
              {data.start?.length === 0 && data.end?.length === 0
                ? ''
                : data.start + ' - ' + data.end}
            </div>
          )}
          {renderEventForDurationInMinSixty(
            original?.eventDurationInMin,
            customiseViewData,
            loggedInUserExternalId
          ) && (
            <div
              className={`essui-global-typography-default-table-header ${styles.customRoomCode} ${textColorClassName}`}
            >
              {original?.room?.name}
            </div>
          )}
        </>
      </div>
      <div
        data-testid="coverEvent"
        className={`essui-global-typography-default-small-bold  ${coverLabelClassName}`}
      >
        {coverLabels}
      </div>
      <>
        {data.original?.recurrence && (
          <Button
            size={ButtonSize.Small}
            color={ButtonColor.Tertiary}
            iconName="repeat"
            className="repeat-button"
          />
        )}
      </>
    </div>
  );
};

// const getColorForLabel = ({
//   original,
//   backgroundColor,
//   hoverColor,
//   outlineColor,
//   customLabelClassName,
//   fillColor
// }: ILabelColor) => {
//   // Ensure outlineColor for allDay/multiDay events is always set from current event
//   if (original.allDay || original.isMultiDay) {
//     outlineColor = getBackgroundColor(original, VARIANT.VARIANT_600);
//   }
//   if (
//     original?.grpExternalId === '00000000-0000-0000-0000-000000000000' &&
//     (original?.grpDesc !== '' || original?.grpDesc !== null)
//   ) {
//     backgroundColor = getVariantColorFromTheme({
//       theme: ColorTheme.NEUTRAL,
//       variant: VARIANT.VARIANT_400
//     });
//     hoverColor = getVariantColorFromTheme({
//       theme: ColorTheme.NEUTRAL,
//       variant: VARIANT.VARIANT_300
//     });
//     outlineColor = backgroundColor;
//   }
//   if (original.isCovered || original.isCovering) {
//     backgroundColor = getVariantColorFromTheme({
//       theme: original.isCovered
//         ? ColorTheme.SUPPORTING_IMPROVEMENT
//         : ColorTheme.PRIMARY,
//       variant: VARIANT.VARIANT_900
//     });
//     hoverColor = getVariantColorFromTheme({
//       theme: original.isCovered
//         ? ColorTheme.SUPPORTING_IMPROVEMENT
//         : ColorTheme.PRIMARY,
//       variant: VARIANT.VARIANT_800
//     });
//     customLabelClassName = styles.customLabelForCover;
//     fillColor = getVariantColorFromTheme({
//       theme: original.isCovered
//         ? ColorTheme.SUPPORTING_IMPROVEMENT
//         : ColorTheme.PRIMARY,
//       variant: VARIANT.VARIANT_700
//     });
//     outlineColor = backgroundColor;
//   }
//   return {
//     backgroundColor,
//     hoverColor,
//     outlineColor,
//     customLabelClassName,
//     fillColor
//   };
// };
