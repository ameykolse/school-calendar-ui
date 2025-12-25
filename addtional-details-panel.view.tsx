import {
  Button,
  ButtonSize,
  Loader,
  LoaderType,
  EditableSidePanel,
  SidePanelContent,
  SidePanelFooter,
  Notification,
  NotificationStatus,
  Tag,
  TagColor,
  Tooltip,
  ButtonColor
} from '@essnextgen/ui-kit';
import styles from './style.module.scss';
import './style.override.scss';
import { MbscCalendarEvent } from '@mobiscroll/react';
import { Timetable } from 'shared/types/staffTimetable';
import { Pupils } from 'shared/types/pupils';
import { useTranslation } from '@essnextgen/ui-intl-kit';

interface IProps {
  isSidePanelOpen: boolean;
  toggleSidePanelOpen: (isopen: boolean) => void;
  sidePanelData: MbscCalendarEvent;
  calendarList: Timetable[];
  activeCalendarId: any;
  pupils: Pupils[];
  isLoader: boolean;
  errCodeMessage: boolean;
  coverStaffName: string;
  originalStaffName: string;
  pupilDetailErrorCodeMessage: string;
  isRegisterCompleted: boolean;
  isAttendanceCodeSuccess: number;
  handleOverflowMenuClick: (e: React.SyntheticEvent, selectedItem: any) => void;
  selectedOverflowMenuItem: any;
  overflowMenuOptions: any[];
}

export const TitleInfo = ({
  sidePanelData,
  t
}: {
  sidePanelData: MbscCalendarEvent;
  t: any;
}) => (
  <>
    <div>
      <div
        className={`essui-global-typography-default-control-label ${styles.marginBottomLabel}`}
      >
        {t('lessonDetailsSidebar.text.eventTitle')}
      </div>
      <div
        className={`essui-global-typography-default-body ${styles.marginBottom}`}
      >
        {sidePanelData?.title}
      </div>
    </div>
  </>
);

export const DateAndTimeInfo = ({
  sidePanelData,
  t
}: {
  sidePanelData: MbscCalendarEvent;
  t: any;
}) => {
  let dateString = '';
  if (sidePanelData?.start && typeof sidePanelData.start === 'string') {
    const date = new Date(sidePanelData.start);
    const day = date.toLocaleDateString(undefined, { weekday: 'long' });
    const dayNum = date.getDate();
    const month = date.toLocaleDateString(undefined, { month: 'long' });
    dateString = `${day} ${dayNum} ${month}`;
  }
  return (
    <>
      <div
        className={`essui-global-typography-default-control-label ${styles.marginBottomLabel}`}
      >
        {t('lessonDetailsSidebar.text.dateAndTime')}
      </div>
      <div
        className={`essui-global-typography-default-body ${styles.marginBottom}`}
      >
        {dateString}
        {sidePanelData?.starttime && sidePanelData?.endtime
          ? ` | ${sidePanelData.starttime} - ${sidePanelData.endtime}`
          : ''}
      </div>
    </>
  );
};

export const CategoryInfo = ({
  sidePanelData,
  t
}: {
  sidePanelData: MbscCalendarEvent;
  t: any;
}) => (
  <>
    <div
      className={`essui-global-typography-default-control-label ${styles.marginBottomLabel}`}
    >
      {t('lessonDetailsSidebar.text.category')}
    </div>
    <div
      className={`essui-global-typography-default-body ${styles.marginBottom}`}
    >
      {sidePanelData?.subject?.name || ''}
    </div>
  </>
);

export const DescriptionInfo = ({
  sidePanelData,
  t
}: {
  sidePanelData: MbscCalendarEvent;
  t: any;
}) => (
  <>
    <div
      className={`essui-global-typography-default-control-label ${styles.marginBottomLabel}`}
    >
      {t('lessonDetailsSidebar.text.description')}
    </div>
    <div
      className={`essui-global-typography-default-body ${styles.marginBottom}`}
    >
      {sidePanelData?.eventDesc || ''}
    </div>
  </>
);

export const AttendeesInfo = ({
  sidePanelData,
  t
}: {
  sidePanelData: MbscCalendarEvent;
  t: any;
}) => {
  if (
    !Array.isArray(sidePanelData?.attendees) ||
    sidePanelData.attendees.length === 0
  ) {
    return null;
  }
  const attendees = sidePanelData.attendees;
  const firstTwo = attendees.slice(0, 2);
  const remaining = attendees.slice(2);
  const remainingCount = remaining.length;

  return (
    <>
      <div
        className={`essui-global-typography-default-control-label ${styles.marginBottomLabel}`}
      >
        {t('lessonDetailsSidebar.text.attendees')}
      </div>
      <div
        className={`essui-global-typography-default-body ${styles.marginBottom}`}
      >
        {firstTwo.map((att: any, idx: number) => (
          <span key={att.id || att}>
            {att.name || att}
            {idx < firstTwo.length - 1 ? ', ' : ''}
          </span>
        ))}
        {remainingCount > 0 && (
          <Tooltip
            content={
              <span>
                {remaining.map((att: any, idx: number) => (
                  <span key={att.id || att}>
                    {att.name || att}
                    {idx < remaining.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </span>
            }
          >
            <Tag
              dataTestId="attendees-remaining-count"
              id="attendees-remaining-count"
              color={TagColor.Primary}
              text={`+${remainingCount}`}
            />
          </Tooltip>
        )}
      </div>
    </>
  );
};

export const RepeatInfo = ({
  sidePanelData,
  t
}: {
  sidePanelData: MbscCalendarEvent;
  t: any;
}) => {
  return (
    <>
      <div
        className={`essui-global-typography-default-control-label ${styles.marginBottomLabel}`}
      >
        {t('lessonDetailsSidebar.text.repeat')}
      </div>
      <div
        className={`essui-global-typography-default-body ${styles.marginBottom}`}
      >
        {sidePanelData?.recurrenceText || 'Does not repeat'}
      </div>
    </>
  );
};

export const LocationInfo = ({
  sidePanelData,
  t
}: {
  sidePanelData: MbscCalendarEvent;
  t: any;
}) => {
  return (
    <>
      <div
        className={`essui-global-typography-default-control-label ${styles.marginBottomLabel}`}
      >
        {t('lessonDetailsSidebar.text.location')}
      </div>
      <div
        className={`essui-global-typography-default-body ${styles.marginBottom}`}
      >
        {sidePanelData?.room?.name || '-'}
      </div>
    </>
  );
};

export const ErrorOrLoader = ({
  errCodeMessage,
  isLoader,
  pupilDetailErrorCodeMessage,
  t
}: {
  errCodeMessage: boolean;
  isLoader: boolean;
  pupilDetailErrorCodeMessage: string;
  t: any;
}) => (
  <>
    {errCodeMessage ? (
      <div
        data-testid="error-label"
        className="essui-global-typography-default-body"
      >
        <Notification
          status={NotificationStatus.WARNING}
          title={
            pupilDetailErrorCodeMessage === 'm1'
              ? t('lessonDetailsSidebar.errorMessagePupilInfo')
              : pupilDetailErrorCodeMessage === 'm2'
              ? t('lessonDetailsSidebar.errorMessagePupilAtt')
              : pupilDetailErrorCodeMessage
          }
          hideCloseButton={true}
        />
      </div>
    ) : (
      isLoader && (
        <Loader
          className="loader-wrapper"
          loaderText={t('loader.loadinghere')}
          loaderType={LoaderType.Circular}
        />
      )
    )}
  </>
);
//side panel view component
export const AdditionalDetailsSidePanelView: ({}: IProps) => JSX.Element = ({
  isSidePanelOpen,
  toggleSidePanelOpen,
  sidePanelData
}: IProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <div
      data-testid="school-calendar-side-panel"
      className="school-calendar-side-panel"
    >
      <EditableSidePanel
        dataTestId="right-pane-sidepanel"
        title={sidePanelData?.title || ''}
        isOpen={isSidePanelOpen}
        onClose={() => {
          toggleSidePanelOpen(false);
        }}
        initialFocusElementId="close-button-id"
      >
        <SidePanelContent className={`${styles.sidePanelTopPadding}`}>
          <>
            <div className="side-panel-header-with-menu">
              <TitleInfo sidePanelData={sidePanelData} t={t} />
            </div>

            <DateAndTimeInfo sidePanelData={sidePanelData} t={t} />
            <RepeatInfo sidePanelData={sidePanelData} t={t} />
            <LocationInfo sidePanelData={sidePanelData} t={t} />
            <CategoryInfo sidePanelData={sidePanelData} t={t} />
            <AttendeesInfo sidePanelData={sidePanelData} t={t} />
            <DescriptionInfo sidePanelData={sidePanelData} t={t} />
          </>
        </SidePanelContent>
        <SidePanelFooter>
          <Button
            size={ButtonSize.Medium}
            color={ButtonColor.Secondary}
            className="btn-full-width cancel-btn"
            onClick={() => {
              toggleSidePanelOpen(false);
            }}
            id="close-button-id"
            dataTestId="close-button"
          >
            {t('lessonDetailsSidebar.button.close')}
          </Button>
        </SidePanelFooter>
      </EditableSidePanel>
    </div>
  );
};
