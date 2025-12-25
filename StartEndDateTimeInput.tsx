import {
  DateInput,
  FormLabel,
  ISelectedItem,
  TimePicker,
  ValidationTextLevel
} from '@essnextgen/ui-kit';
import {
  UseTranslationResponse,
  useTranslation
} from '@essnextgen/ui-intl-kit';
import dateTimeCss from '../style.module.scss';
import {
  handleEndDateChange,
  handleEndTimeChange,
  handleStartDateChange,
  handleStartTimeChange
} from '../AddEditSchoolEventUtils';

const StartEndDateTimeInput: any = (props: any) => {
  const { t }: UseTranslationResponse<'translation', undefined> =
    useTranslation();

  const { eventFormData, dispatch, validationMessages }: any = props;

  const startDateChangeHandler = (
    day: string | number,
    month: string | number,
    year: string | number
  ) => {
    handleStartDateChange(
      eventFormData,
      { day, month, year },
      dispatch,
      validationMessages
    );
  };

  const onStartDateValidateChange = (date: Date) => {
    const day = Number(date?.getDate());
    const month = Number(date?.getMonth()) + 1;
    const year = Number(date?.getFullYear());

    handleStartDateChange(
      eventFormData,
      { day, month, year },
      dispatch,
      validationMessages
    );
  };

  const endDateChangeHandler = (
    day: string | number,
    month: string | number,
    year: string | number
  ) => {
    handleEndDateChange(
      eventFormData,
      { day, month, year },
      dispatch,
      validationMessages
    );
  };

  const onEndDateValidateChange = (date: Date) => {
    const day = Number(date?.getDate());
    const month = Number(date?.getMonth()) + 1;
    const year = Number(date?.getFullYear());

    handleEndDateChange(
      eventFormData,
      { day, month, year },
      dispatch,
      validationMessages
    );
  };

  const handleStartTimeDropdown = (
    e: React.SyntheticEvent,
    item: ISelectedItem
  ) => {
    handleStartTimeChange(eventFormData, item, dispatch, validationMessages);
  };

  const handleEndTimeDropdown = (
    e: React.SyntheticEvent,
    item: ISelectedItem
  ) => {
    handleEndTimeChange(eventFormData, item, dispatch, validationMessages);
  };

  return (
    <div className={dateTimeCss['date-section-container']}>
      <div className={dateTimeCss['start-date-time-section']}>
        <div className={dateTimeCss['date-section']}>
          <FormLabel>
            {t('addEditSchoolEvent.startEndDateTimeInput.startDateLabel')}
          </FormLabel>
          <DateInput
            day={eventFormData.startDate?.day || ''}
            month={eventFormData.startDate?.month || ''}
            year={eventFormData.startDate?.year || ''}
            onChange={(
              day: string | number,
              month: string | number,
              year: string | number
            ) => startDateChangeHandler(day, month, year)}
            onValidateDate={(date: Date) => {
              onStartDateValidateChange(date);
            }}
            dataTestId="testid-date-start-date"
            showDatePicker
            validationText={validationMessages?.startDate || ''}
            validationTextLevel={
              validationMessages?.startDate
                ? ValidationTextLevel.Error
                : undefined
            }
            invalidDateErrorMessage={t(
              'addEditSchoolEvent.validationMessages.invalidDate'
            )}
          />
        </div>
        {!eventFormData.isAllDayEvent && (
          <div className={dateTimeCss['time-section']}>
            <FormLabel>
              {t('addEditSchoolEvent.startEndDateTimeInput.startTimeLabel')}
            </FormLabel>
            <TimePicker
              dataTestId="test-id-start"
              id="element-id-start"
              className={dateTimeCss['time-picker']}
              onSelect={handleStartTimeDropdown}
              selectedItem={eventFormData?.startTime}
              //disabledListItem={disableStartTime}
              placeholderText={'00:00'}
              //onKeyDown={onKeyDown}
              //onChange={onStartTimeChange}
              timeSlotInterval={15}
              startTimeInput={'00:00'}
              isTimePicker={true}
              endTimeInput={'23:59'}
              validationText={validationMessages?.startTime || ''}
              validationTextLevel={
                validationMessages?.startTime
                  ? ValidationTextLevel.Error
                  : undefined
              }
              InvalidTimeMessage={t(
                'addEditSchoolEvent.validationMessages.invalidTime'
              )}
            />
          </div>
        )}
      </div>
      <div className={dateTimeCss['end-date-time-section']}>
        <div className={dateTimeCss['date-section']}>
          <FormLabel>
            {t('addEditSchoolEvent.startEndDateTimeInput.endDateLabel')}
          </FormLabel>
          <DateInput
            day={eventFormData?.endDate?.day || ''}
            month={eventFormData?.endDate?.month || ''}
            year={eventFormData?.endDate?.year || ''}
            onChange={(
              day: string | number,
              month: string | number,
              year: string | number
            ) => endDateChangeHandler(day, month, year)}
            onValidateDate={(date: Date) => {
              onEndDateValidateChange(date);
            }}
            dataTestId="testid-date-end-date"
            showDatePicker
            validationText={validationMessages?.endDate || ''}
            validationTextLevel={
              validationMessages?.endDate
                ? ValidationTextLevel.Error
                : undefined
            }
            invalidDateErrorMessage={t(
              'addEditSchoolEvent.validationMessages.invalidDate'
            )}
          />
        </div>
        {!eventFormData.isAllDayEvent && (
          <div className={dateTimeCss['time-section']}>
            <FormLabel>
              {t('addEditSchoolEvent.startEndDateTimeInput.endTimeLabel')}
            </FormLabel>
            <TimePicker
              dataTestId="test-id-end"
              id="element-id-end"
              className={dateTimeCss['time-picker']}
              onSelect={handleEndTimeDropdown}
              selectedItem={eventFormData?.endTime}
              //disabledListItem={disableStartTime}
              placeholderText={'00:00'}
              timeSlotInterval={15}
              startTimeInput={'00:00'}
              endTimeInput={'23:59'}
              validationText={validationMessages?.endTime || ''}
              validationTextLevel={
                validationMessages?.endTime
                  ? ValidationTextLevel.Error
                  : undefined
              }
              InvalidTimeMessage={t(
                'addEditSchoolEvent.validationMessages.invalidTime'
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StartEndDateTimeInput;
