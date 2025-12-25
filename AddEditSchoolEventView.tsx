import {
  useTranslation,
  UseTranslationResponse
} from '@essnextgen/ui-intl-kit';
import {
  Button,
  ButtonColor,
  ButtonSize,
  IconColor,
  Loader,
  LoaderType,
  SidePanel,
  SidePanelContent,
  SidePanelFooter,
  Notification,
  NotificationStatus
} from '@essnextgen/ui-kit';
import EventCategoryDropdown from './components/EventCategoryDropdown';
import addEditSchoolEventCss from './style.module.scss';
import EventTitleTextInput from './components/EventTitleTextInput';
import AllDayCheckBox from './components/AllDayCheckBox';
import StartEndDateTimeInput from './components/StartEndDateTimeInput';
import RepeatComponentView from './components/RepeatComponentView';
import LocationDropdownView from './components/LocationDropdownView';
import AttendeesView from './components/AttendeesView';
import EventDescriptionTextInput from './components/EventDescriptionTextInput';
import { IAddEditSchoolEventProps } from './AddEditSchoolEventProps';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../redux/rootReducer';
import { setSaveAPICall } from '../../../redux/slices/manageEventSlice';

const AddEditSchoolEventView = ({
  isSidePanelOpen,
  handleCloseSidePanel,
  inputref,
  eventFormData,
  handleSaveClick,
  validationMessages,
  attendeesSuggestionList,
  setAttendeesSuggestionList,
  attendeesList,
  setIsAttendeesLoading,
  isAttendeesLoading,
  selectedAttendees,
  setSelectedAttendees,
  saveAPICall
}: IAddEditSchoolEventProps) => {
  const { t }: UseTranslationResponse<'translation', undefined> =
    useTranslation();

  const dispatch: AppDispatch = useDispatch<AppDispatch>();

  return (
    <>
      <SidePanel
        dataTestId="Expanded-Side-Panel"
        id="addEditSchoolEventSidePanel"
        className={addEditSchoolEventCss.sidepanelcontainer}
        headerIconColor={IconColor.Neutral}
        onClose={() => handleCloseSidePanel()}
        title={t('addEditSchoolEvent.sidepanel.calendarEvent')}
        isOpen={isSidePanelOpen}
        isOnClose
      >
        <>
          <SidePanelContent
            className={
              saveAPICall?.loading
                ? addEditSchoolEventCss.sidepanelcontentloading
                : addEditSchoolEventCss.sidepanelcontent
            }
          >
            <>
              {saveAPICall?.failure && (
                <Notification
                  dataTestId="event-error-notification"
                  className="custom-error-banner w-100"
                  title={t('notifications.unableToSave')}
                  status={NotificationStatus.WARNING}
                  message={t('notifications.apiFailedToLoadData')}
                  onClickClose={() => {
                    dispatch(
                      setSaveAPICall({
                        ...saveAPICall,
                        failure: false
                      })
                    );
                  }}
                />
              )}
              {saveAPICall?.loading && (
                <div className={addEditSchoolEventCss['loader-container']}>
                  <Loader
                    className="scroller"
                    dataTestId="Addattendance-loader"
                    loaderText={t('loader.pleaseWait')}
                    loaderType={LoaderType.Circular}
                  />
                </div>
              )}
              <div className={addEditSchoolEventCss['school-event-panel']}>
                <EventTitleTextInput
                  inputref={inputref}
                  eventFormData={eventFormData}
                  dispatch={dispatch}
                />
                <EventCategoryDropdown
                  eventFormData={eventFormData}
                  dispatch={dispatch}
                  validationMessages={validationMessages}
                />
                <div
                  className={
                    addEditSchoolEventCss['other-event-details-container']
                  }
                >
                  <AllDayCheckBox
                    eventFormData={eventFormData}
                    dispatch={dispatch}
                  />
                  <StartEndDateTimeInput
                    eventFormData={eventFormData}
                    dispatch={dispatch}
                    validationMessages={validationMessages}
                  />
                  <RepeatComponentView />
                  <LocationDropdownView
                    eventFormData={eventFormData}
                    dispatch={dispatch}
                  />
                  <AttendeesView
                    dispatch={dispatch}
                    attendeesSuggestionList={attendeesSuggestionList}
                    setAttendeesSuggestionList={setAttendeesSuggestionList}
                    attendeesList={attendeesList}
                    isAttendeesLoading={isAttendeesLoading}
                    setIsAttendeesLoading={setIsAttendeesLoading}
                    selectedAttendees={selectedAttendees}
                    setSelectedAttendees={setSelectedAttendees}
                  />
                </div>
                <EventDescriptionTextInput
                  eventFormData={eventFormData}
                  dispatch={dispatch}
                />
              </div>
            </>
          </SidePanelContent>

          <SidePanelFooter>
            <Button
              dataTestId="closeSidePanel"
              id="closeSidePanel"
              className="btn-full-width"
              color={ButtonColor.Secondary}
              size={ButtonSize.Medium}
              onClick={() => handleCloseSidePanel()}
            >
              {t('commonButtons.cancel')}
            </Button>
            <Button
              dataTestId="saveSidePanelBtn"
              className="btn-full-width"
              size={ButtonSize.Medium}
              onClick={() => handleSaveClick()}
            >
              {t('commonButtons.save')}
            </Button>
          </SidePanelFooter>
        </>
      </SidePanel>
    </>
  );
};

export default AddEditSchoolEventView;
