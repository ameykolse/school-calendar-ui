import { FormLabel, TextInput, ValidationTextLevel } from '@essnextgen/ui-kit';
import {
  UseTranslationResponse,
  useTranslation
} from '@essnextgen/ui-intl-kit';
import EventTitleCss from '../style.module.scss';
import { handleEventTitleChange } from '../AddEditSchoolEventUtils';

const EventTitleTextInput: any = (props: any) => {
  const { t }: UseTranslationResponse<'translation', undefined> =
    useTranslation();
  const { inputref, eventFormData, dispatch }: any = props;

  return (
    <>
      <div className={EventTitleCss['event-title-input-container']}>
        <FormLabel>
          {t('addEditSchoolEvent.eventTitleTextInput.label')}
        </FormLabel>

        <TextInput
          {...props}
          className={EventTitleCss['input-text']}
          value={eventFormData?.eventTitle || ''}
          isLabel
          onChange={event =>
            handleEventTitleChange(eventFormData, event, dispatch)
          }
          inputRef={inputref}
          placeholderText={t(
            'addEditSchoolEvent.eventTitleTextInput.placeholder'
          )}
          dataTestId="EventTitle-TextInput-test-id"
          validationText=""
          validationTextLevel={false && ValidationTextLevel.Error}
          maxLength={60}
        />
      </div>
    </>
  );
};

export default EventTitleTextInput;
