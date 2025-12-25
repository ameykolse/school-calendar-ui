import { FormLabel, Textarea, ValidationTextLevel } from '@essnextgen/ui-kit';
import {
  UseTranslationResponse,
  useTranslation
} from '@essnextgen/ui-intl-kit';
import EventDescriptionCss from '../style.module.scss';
import { handleEventDescriptionChange } from '../AddEditSchoolEventUtils';

const EventDescriptionTextInput: any = (props: any) => {
  const { t }: UseTranslationResponse<'translation', undefined> =
    useTranslation();
  const { eventFormData, dispatch }: any = props;

  return (
    <>
      <div className={EventDescriptionCss['event-description-input-container']}>
        <FormLabel>
          {t('addEditSchoolEvent.eventDescriptionTextInput.label')}
        </FormLabel>

        <Textarea
          {...props}
          className={EventDescriptionCss['input-text']}
          value={eventFormData?.eventDescription || ''}
          isLabel
          onChange={e => {
            handleEventDescriptionChange(eventFormData, e, dispatch);
          }}
          //inputRef={inputref}
          placeholderText={t(
            'addEditSchoolEvent.eventDescriptionTextInput.placeholder'
          )}
          dataTestId="EventDescription-TextInput-test-id"
          validationText=""
          validationTextLevel={false && ValidationTextLevel.Error}
          maxLength={500}
        />
      </div>
    </>
  );
};

export default EventDescriptionTextInput;
