import { CheckBox } from '@essnextgen/ui-kit';
import {
  UseTranslationResponse,
  useTranslation
} from '@essnextgen/ui-intl-kit';
import CheckBoxCss from '../style.module.scss';
import { handleAllDayCheckboxChange } from '../AddEditSchoolEventUtils';

const AllDayCheckBox: any = (props: any) => {
  const { t }: UseTranslationResponse<'translation', undefined> =
    useTranslation();
  const { eventFormData, dispatch }: any = props;
  return (
    <>
      <div className={CheckBoxCss['all-day-checkbox-container']}>
        <CheckBox
          id="udf-yes-checkbox"
          dataTestId="udf-yes-checkbox-test-id"
          label={t('addEditSchoolEvent.allDayCheckBox.label')}
          isSelected={eventFormData.isAllDayEvent}
          onChange={e => {
            handleAllDayCheckboxChange(
              eventFormData,
              e as React.ChangeEvent<HTMLInputElement>,
              dispatch
            );
          }}
        />
      </div>
    </>
  );
};

export default AllDayCheckBox;
