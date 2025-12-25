import { useDispatch, useSelector } from 'react-redux';
import AddEditSchoolEventView from './AddEditSchoolEventView';
import { RootState } from '../../../redux/rootReducer';
import {
  setAddEditDiscardPopupOpen,
  setEventFormData,
  setValidationMessages
} from '../../../redux/slices/manageEventSlice';
import { useEffect, useRef, useState } from 'react';
import {
  IAddEditRequestPayload,
  IAttendeesResponseList,
  IEventFormData,
  ISelectedAttendees,
  IValidationMessages
} from './AddEditSchoolEventProps';
import fetchRoomList from '../../../redux/ThunkActions/getRoomsList';
import fetchActiveEventCategories from '../../../redux/ThunkActions/getEventCategoryList';
import {
  UseTranslationResponse,
  useTranslation
} from '@essnextgen/ui-intl-kit';
import fetchAttendeesList from '../../../redux/ThunkActions/getAttendeesList';
import { resetChanges } from './AddEditSchoolEventUtils';
import AddEditEventDiscardPopup from './components/AddEditEventDiscardPopup';
import { addSchoolEvent, updateSchoolEvent } from '../../../redux/ThunkActions/AddSchoolEvent';

const AddEditSchoolEventLogic = () => {
  const { t }: UseTranslationResponse<'translation', undefined> =
    useTranslation();
  const dispatch: any = useDispatch<any>();
  const inputref: React.MutableRefObject<any> = useRef();

  const [attendeesSuggestionList, setAttendeesSuggestionList]: any = useState(
    []
  );
  const [isAttendeesLoading, setIsAttendeesLoading] = useState<boolean>(false);
  const [selectedAttendees, setSelectedAttendees] = useState<
    ISelectedAttendees[]
  >([]);

  const {
    isAddEditSidePanelOpen,
    eventFormData,
    validationMessages,
    originalAttendeesList,
    isAddEditDiscardPopupOpen,
    saveAPICall
  }: {
    isAddEditSidePanelOpen: boolean;
    eventFormData: IEventFormData;
    validationMessages: IValidationMessages;
    originalAttendeesList: IAttendeesResponseList[];
    isAddEditDiscardPopupOpen: boolean;
    saveAPICall: {
      success: boolean;
      failure: boolean;
      loading: boolean;
    };
  } = useSelector((state: RootState) => state.manageEvents);

  useEffect(() => {
    dispatch(fetchAttendeesList());
    dispatch(fetchActiveEventCategories());
    dispatch(fetchRoomList());
  }, [dispatch]);

  const handleCloseSidePanel = () => {
    if (eventFormData?.isFormDataModified || selectedAttendees?.length > 0) {
      dispatch(setAddEditDiscardPopupOpen(true));
    } else {
      resetChanges(dispatch);
    }
  };

  const handleSaveClick = () => {
    let validationMessages: IValidationMessages = {};
    if (!eventFormData?.category) {
      validationMessages.category = t(
        'addEditSchoolEvent.validationMessages.categoryIsRequired'
      );
    }
    if (
      eventFormData?.startDate &&
      (eventFormData?.startDate?.day === '' ||
        eventFormData?.startDate?.month === '' ||
        eventFormData?.startDate?.year === '')
    ) {
      validationMessages.startDate = t(
        'addEditSchoolEvent.validationMessages.invalidDate'
      );
    }
    if (
      !eventFormData?.startDate ||
      (eventFormData?.startDate &&
        eventFormData?.startDate?.day === '' &&
        eventFormData?.startDate?.month === '' &&
        eventFormData?.startDate?.year === '')
    ) {
      validationMessages.startDate = t(
        'addEditSchoolEvent.validationMessages.startDateIsRequired'
      );
    }
    if (
      eventFormData?.endDate &&
      (eventFormData?.endDate?.day === '' ||
        eventFormData?.endDate?.month === '' ||
        eventFormData?.endDate?.year === '')
    ) {
      validationMessages.endDate = t(
        'addEditSchoolEvent.validationMessages.invalidDate'
      );
    }
    if (
      !eventFormData?.endDate ||
      (eventFormData?.endDate &&
        eventFormData?.endDate?.day === '' &&
        eventFormData?.endDate?.month === '' &&
        eventFormData?.endDate?.year === '')
    ) {
      validationMessages.endDate = t(
        'addEditSchoolEvent.validationMessages.endDateIsRequired'
      );
    }
    if (!eventFormData?.startTime) {
      validationMessages.startTime = t(
        'addEditSchoolEvent.validationMessages.startTimeIsRequired'
      );
    }
    if (!eventFormData?.endTime) {
      validationMessages.endTime = t(
        'addEditSchoolEvent.validationMessages.endTimeIsRequired'
      );
    }
    const endDateObj = new Date(
      Number(eventFormData?.endDate?.year),
      Number(eventFormData?.endDate?.month),
      Number(eventFormData?.endDate?.day)
    );

    const startDateObj = new Date(
      Number(eventFormData?.startDate?.year),
      Number(eventFormData?.startDate?.month),
      Number(eventFormData?.startDate?.day)
    );

    if (
      eventFormData?.startDate &&
      eventFormData?.endDate &&
      endDateObj < startDateObj
    ) {
      validationMessages.endDate = t(
        'addEditSchoolEvent.validationMessages.endDateMustBeAfterStartDate'
      );
    }
    if (
      eventFormData?.startDate &&
      eventFormData?.endDate &&
      eventFormData?.startTime?.value &&
      eventFormData?.endTime?.value &&
      eventFormData?.startDate?.year === eventFormData?.endDate?.year &&
      eventFormData?.startDate?.month === eventFormData?.endDate?.month &&
      eventFormData?.startDate?.day === eventFormData?.endDate?.day
    ) {
      const [startHour, startMinute] = eventFormData?.startTime?.value
        .split(':')
        .map(Number);
      const [endHour, endMinute] = eventFormData?.endTime?.value
        .split(':')
        .map(Number);
      const startTimeValue = startHour * 60 + startMinute;
      const endTimeValue = endHour * 60 + endMinute;
      if (endTimeValue <= startTimeValue) {
        validationMessages.endTime = t(
          'addEditSchoolEvent.validationMessages.endTimeMustBeAfterStartTime'
        );
      }
    }
    if (Object.keys(validationMessages).length > 0) {
      dispatch(setValidationMessages(validationMessages));
      return;
    }
    dispatch(
      setEventFormData({
        ...eventFormData,
        saveAPICall: {
          success: false,
          failure: false,
          loading: true
        }
      })
    );
    const attendeesExternalIds: string[] = selectedAttendees.map(
      attendee => attendee.id
    );

    let [startHour, startMinute] = eventFormData?.startTime?.value
      ? eventFormData.startTime.value.split(':').map(Number)
      : [0, 0];

    let [endHour, endMinute] = eventFormData?.endTime?.value
      ? eventFormData.endTime.value.split(':').map(Number)
      : [0, 0];

    if (eventFormData.isAllDayEvent) {
      startHour = 0;
      startMinute = 0;
      endHour = 23;
      endMinute = 59;
    }

    const eventStartDateString = `${eventFormData?.startDate?.year}-${
      eventFormData?.startDate?.month
    }-${eventFormData?.startDate?.day}T${
      startHour < 10 ? '0' + startHour : startHour
    }:${startMinute < 10 ? '0' + startMinute : startMinute}:00.000Z`;
    const eventEndDateString = `${eventFormData?.endDate?.year}-${
      eventFormData?.endDate?.month
    }-${eventFormData?.endDate?.day}T${
      endHour < 10 ? '0' + endHour : endHour
    }:${endMinute < 10 ? '0' + endMinute : endMinute}:00.000Z`;

    const payload: IAddEditRequestPayload = {
      eventTitle: eventFormData?.eventTitle || '',
      eventStart: eventStartDateString,
      eventEnd: eventEndDateString,
      isAllDayEvent: eventFormData?.isAllDayEvent || false,
      roomExternalId: eventFormData?.location?.value || '',
      categoryExternalId: eventFormData?.category?.value || '',
      description: eventFormData?.description || '',
      repeatType: null,
      repeatEndDate: null,
      endAfterOccurrences: null,
      weeklyRepeatFrequency: null,
      monthlyRepeatFrequency: null,
      daysOfWeek: null,
      dayOfMonth: null,
      weekdayOfMonth: null,
      skipHolidays: false,
      attendees: attendeesExternalIds || []
    };
    if (eventFormData?.eventExternalId) {      
      dispatch(
        updateSchoolEvent({
          ...payload,
          eventExternalId: eventFormData.eventExternalId
        })
      );
    } else {
      dispatch(addSchoolEvent(payload));
    }
  };

  return (
    <>
      <AddEditSchoolEventView
        isSidePanelOpen={isAddEditSidePanelOpen}
        handleCloseSidePanel={handleCloseSidePanel}
        inputref={inputref}
        eventFormData={eventFormData}
        handleSaveClick={handleSaveClick}
        validationMessages={validationMessages}
        attendeesSuggestionList={attendeesSuggestionList}
        setAttendeesSuggestionList={setAttendeesSuggestionList}
        attendeesList={originalAttendeesList}
        setIsAttendeesLoading={setIsAttendeesLoading}
        isAttendeesLoading={isAttendeesLoading}
        selectedAttendees={selectedAttendees}
        setSelectedAttendees={setSelectedAttendees}
        saveAPICall={saveAPICall}
      />

      <AddEditEventDiscardPopup
        isAddEditDiscardPopupOpen={isAddEditDiscardPopupOpen}
      />
    </>
  );
};

export default AddEditSchoolEventLogic;
