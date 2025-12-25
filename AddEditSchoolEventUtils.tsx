import {
  resetEventFormData,
  resetValidationMessages,
  setAddEditDiscardPopupOpen,
  setAddEditSidePanelOpen,
  setAttendeesSearchText,
  setEventFormData,
  setValidationMessages
} from '../../../redux/slices/manageEventSlice';
import {
  IActualAttendeesList,
  IAttendeesResponseList,
  IDateInput,
  IEventFormData,
  IValidationMessages
} from './AddEditSchoolEventProps';
import { AppDispatch } from '../../../redux/rootReducer';
import React from 'react';
import { ISelectedItem } from '@essnextgen/ui-kit';
import { GroupTypeCodes, groupTypes } from '../../../shared/types/calendar';
import { MbscCalendarEvent } from '@mobiscroll/react';

export const handleEventTitleChange = (
  eventFormData: IEventFormData,
  event: React.ChangeEvent<HTMLInputElement>,
  dispatch: AppDispatch
) => {
  const { value } = event.target;
  dispatch(
    setEventFormData({
      ...eventFormData,
      eventTitle: value,
      isFormDataModified: true
    })
  );
};

export const handleAllDayCheckboxChange = (
  eventFormData: IEventFormData,
  event: React.ChangeEvent<HTMLInputElement>,
  dispatch: AppDispatch
) => {
  const { checked } = event.target;

  dispatch(
    setEventFormData({
      ...eventFormData,
      isAllDayEvent: checked,
      isFormDataModified: true
    })
  );
};

export const handleEventDescriptionChange = (
  eventFormData: IEventFormData,
  event: React.ChangeEvent<HTMLTextAreaElement>,
  dispatch: AppDispatch
) => {
  const { value } = event.target;
  dispatch(
    setEventFormData({
      ...eventFormData,
      description: value,
      isFormDataModified: true
    })
  );
};

export const handleStartDateChange = (
  eventFormData: IEventFormData,
  date: IDateInput,
  dispatch: AppDispatch,
  validationMessages: IValidationMessages
) => {
  dispatch(
    setEventFormData({
      ...eventFormData,
      startDate: date,
      isFormDataModified: true
    })
  );
  dispatch(
    setValidationMessages({
      ...validationMessages,
      startDate: ''
    })
  );
};

export const handleEndDateChange = (
  eventFormData: IEventFormData,
  date: IDateInput,
  dispatch: AppDispatch,
  validationMessages: IValidationMessages
) => {
  dispatch(
    setEventFormData({
      ...eventFormData,
      endDate: date,
      isFormDataModified: true
    })
  );
  dispatch(
    setValidationMessages({
      ...validationMessages,
      endDate: ''
    })
  );
};

export const handleStartTimeChange = (
  eventFormData: IEventFormData,
  time: ISelectedItem,
  dispatch: AppDispatch,
  validationMessages: IValidationMessages
) => {
  dispatch(
    setEventFormData({
      ...eventFormData,
      startTime: time,
      isFormDataModified: true
    })
  );
  dispatch(
    setValidationMessages({
      ...validationMessages,
      startTime: ''
    })
  );
};

export const handleEndTimeChange = (
  eventFormData: IEventFormData,
  time: ISelectedItem,
  dispatch: AppDispatch,
  validationMessages: IValidationMessages
) => {
  dispatch(
    setEventFormData({
      ...eventFormData,
      endTime: time,
      isFormDataModified: true
    })
  );
  dispatch(
    setValidationMessages({
      ...validationMessages,
      endTime: ''
    })
  );
};

export const handleLocationDropdownChange = (
  eventFormData: IEventFormData,
  location: ISelectedItem,
  dispatch: AppDispatch
) => {
  dispatch(
    setEventFormData({
      ...eventFormData,
      location: location,
      isFormDataModified: true
    })
  );
};
export const handleEventCategoryChange = (
  eventFormData: IEventFormData,
  category: ISelectedItem,
  dispatch: AppDispatch,
  validationMessages: IValidationMessages
) => {
  dispatch(
    setEventFormData({
      ...eventFormData,
      category: category,
      isFormDataModified: true
    })
  );
  dispatch(
    setValidationMessages({
      ...validationMessages,
      category: ''
    })
  );
};

export const setIntialDateTime = (
  day: number,
  month: number,
  year: number,
  hour: number,
  minute: number,
  eventFormData: IEventFormData,
  dispatch: AppDispatch
) => {
  const date: IDateInput = {
    day: day,
    month: month,
    year: year
  };

  if (hour <= 0) hour = 8;
  if (minute <= 0) {
    minute = 30;
  }

  const startTime: ISelectedItem = {
    value: `${hour < 10 ? '0' : ''}${hour}:${minute
      .toString()
      .padStart(2, '0')}`,
    text: `${hour < 10 ? '0' : ''}${hour}:${minute.toString().padStart(2, '0')}`
  };
  // Calculate end time as 30 minutes after start time
  let endHour = hour;
  let endMinute = minute + 30;
  if (endMinute >= 60) {
    endHour += Math.floor(endMinute / 60);
    endMinute = endMinute % 60;
  }
  const endTime: ISelectedItem = {
    value: `${endHour < 10 ? '0' : ''}${endHour}:${endMinute
      .toString()
      .padStart(2, '0')}`,
    text: `${endHour < 10 ? '0' : ''}${endHour}:${endMinute
      .toString()
      .padStart(2, '0')}`
  };

  dispatch(
    setEventFormData({
      ...eventFormData,
      startDate: date,
      endDate: date,
      startTime: startTime,
      endTime: endTime
    })
  );
};

export const getActualAttendeesList = (
  allAttendeesList: IAttendeesResponseList[]
) => {
  const actualAttendeesList: IActualAttendeesList = {
    Tiers:
      allAttendeesList?.filter(
        attendee => attendee.groupType === GroupTypeCodes.SchoolTier
      ) || [],
    Houses:
      allAttendeesList?.filter(
        attendee => attendee.groupType === GroupTypeCodes.House
      ) || [],
    UserDefinedGroups:
      allAttendeesList?.filter(
        attendee => attendee.groupType === GroupTypeCodes.User
      ) || [],
    RegistrationGroups:
      allAttendeesList?.filter(
        attendee => attendee.groupType === GroupTypeCodes.PrimaryClass
      ) || [],
    Classes:
      allAttendeesList?.filter(
        attendee => attendee.groupType === GroupTypeCodes.Class
      ) || [],
    YearGroups:
      allAttendeesList?.filter(
        attendee => attendee.groupType === GroupTypeCodes.YearGroup
      ) || []
  };
  return actualAttendeesList;
};

export const attendeesSearchHandler = (
  searchValue: string | undefined,
  setAttendeesSuggestionList: any,
  attendeesList: IAttendeesResponseList[],
  dispatch: AppDispatch,
  setIsAttendeesLoading: (loading: boolean) => void
) => {
  const searchVal: any = searchValue;
  dispatch(setAttendeesSearchText(searchVal ?? ''));

  const filteredAttendees = attendeesList?.filter(
    (attendee: IAttendeesResponseList) =>
      attendee.groupName.toLowerCase().includes(searchVal.toLowerCase())
  );

  const actualAttendeesList: IActualAttendeesList =
    getActualAttendeesList(filteredAttendees);

  const searchSuggestionData: any[] = [];
  groupTypes.forEach(({ key, label }) => {
    const groupList = (actualAttendeesList as any)?.[key];
    if (groupList?.length > 0) {
      searchSuggestionData.push({
        name: label,
        values: groupList.map((item: IAttendeesResponseList) => ({
          text: item?.groupName,
          props: {
            id: item?.groupExternalId,
            name: item?.groupName
          },
          key: item?.groupName,
          values: item?.groupExternalId
        }))
      });
    }
  });

  if (searchSuggestionData?.length === 1) {
    searchSuggestionData.push({
      name: '',
      values: []
    });
  }
  setAttendeesSuggestionList(searchSuggestionData);
  setIsAttendeesLoading(false);
};

export const resetChanges = (dispatch: AppDispatch) => {
  dispatch(setAddEditDiscardPopupOpen(false));
  dispatch(resetEventFormData());
  dispatch(resetValidationMessages());
  dispatch(setAddEditSidePanelOpen(false));
};

export const populateEventFormForEdit = (
  eventData: MbscCalendarEvent,
  dispatch: AppDispatch
) => {
  const startDate = new Date(eventData.start as string | Date);
  const endDate = new Date(eventData.end as string | Date);
  const formatTime = (date: Date) => {
    const h = date.getHours();
    const m = date.getMinutes();
    const timeString = `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`;
    return { value: timeString, text: timeString };
  };

  const formData: IEventFormData = {
    eventExternalId: eventData.id as string,
    eventTitle: eventData.title,
    description: eventData.eventDesc,
    isAllDayEvent: eventData.allDay || false,
    startDate: {
      day: startDate.getDate(),
      month: startDate.getMonth() + 1,
      year: startDate.getFullYear()
    },
    endDate: {
      day: endDate.getDate(),
      month: endDate.getMonth() + 1,
      year: endDate.getFullYear()
    },
    startTime: formatTime(startDate),
    endTime: formatTime(endDate),

    category: eventData.eventCategories
      ? {
          value: eventData.eventCategories.eventCategoryExternalId || eventData.eventCategories.id,
          text: eventData.eventCategories.eventCategoryName
        }
      : undefined,

    location: eventData.room
      ? {
          value: eventData.room.externalId || eventData.room.id,
          text: eventData.room.name
        }
      : undefined,

    attendeesExternalIds: eventData.attendees
      ? eventData.attendees.map((a: any) => a.id)
      : [],

    isFormDataModified: false
  };

  dispatch(setEventFormData(formData));
};
