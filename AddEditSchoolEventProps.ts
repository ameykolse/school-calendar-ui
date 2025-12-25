import { ISelectedItem } from '@essnextgen/ui-kit';

export type IAddEditSchoolEventProps = {
  isSidePanelOpen: boolean;
  handleCloseSidePanel: () => void;
  inputref: React.MutableRefObject<any>;
  eventFormData?: IEventFormData;
  handleSaveClick: () => void;
  validationMessages: IValidationMessages;
  attendeesSuggestionList: any[];
  setAttendeesSuggestionList: (attendees: any[]) => void;
  attendeesList: IAttendeesResponseList[];
  isAttendeesLoading: boolean;
  setIsAttendeesLoading: (isAttendeesLoading: boolean) => void;
  selectedAttendees: any[];
  setSelectedAttendees: (selectedAttendees: any[]) => void;
  saveAPICall: {
    success: boolean;
    failure: boolean;
    loading: boolean;
  };
};

export type IEventFormData = {
  eventTitle?: string;
  startDate: IDateInput | undefined;
  endDate: IDateInput | undefined;
  startTime: ISelectedItem | undefined;
  endTime: ISelectedItem | undefined;
  isAllDayEvent: boolean;
  description?: string;
  repeatInfo?: string;
  location?: ISelectedItem;
  category?: ISelectedItem;
  eventType?: string;
  attendeesExternalIds?: string[];
  isFormDataModified?: boolean;
  eventExternalId?: string;
};

export type IDateInput = {
  day: string | number;
  month: string | number;
  year: string | number;
};

export type IRoomList = {
  externalId: string;
  roomCode: string;
  roomName: string;
  maxGroupSize?: number;
  area?: number;
  telephoneNo?: string;
  excludeFromCover: boolean;
  siteName?: string;
};

export type IActiveEventCategory = {
  categoryID: string;
  categoryName: string;
  status: boolean;
  eventTypeCode: string;
  eventTypeExternalId: string;
  eventTypeDescription: string;
};

export type IValidationMessages = {
  category?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
};

export type IAttendeesResponseList = {
  groupExternalId: string;
  groupName: string;
  groupType: string;
};

export type IActualAttendeesList = {
  Tiers: IAttendeesResponseList[];
  YearGroups: IAttendeesResponseList[];
  RegistrationGroups: IAttendeesResponseList[];
  Houses: IAttendeesResponseList[];
  Classes: IAttendeesResponseList[];
  UserDefinedGroups: IAttendeesResponseList[];
};

export type ISelectedAttendees = {
  name: string;
  id: any;
};

export type IAddEditRequestPayload = {
  eventTitle: string;
  eventStart: string;
  eventEnd: string;
  isAllDayEvent: boolean;
  roomExternalId: string;
  categoryExternalId: string;
  description: string;
  repeatType: string | null;
  repeatEndDate: Date | null;
  endAfterOccurrences: number | null;
  weeklyRepeatFrequency: number | null;
  monthlyRepeatFrequency: number | null;
  daysOfWeek: number | null;
  dayOfMonth: number | null;
  weekdayOfMonth: number | null;
  skipHolidays: boolean;
  attendees: string[];
};
