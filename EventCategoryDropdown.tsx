import {
  Dropdown,
  DropdownItem,
  FormLabel,
  ISelectedItem,
  ValidationTextLevel
} from '@essnextgen/ui-kit';
import {
  UseTranslationResponse,
  useTranslation
} from '@essnextgen/ui-intl-kit';
import EventCategoryDropdownCss from '../style.module.scss';
import { useSelector } from 'react-redux';
import { IActiveEventCategory } from '../AddEditSchoolEventProps';
import { RootState } from 'src/redux/rootReducer';
import { generateUniqueId } from 'shared/util';
import { handleEventCategoryChange } from '../AddEditSchoolEventUtils';

const EventCategoryDropdown: any = (props: any) => {
  const { t }: UseTranslationResponse<'translation', undefined> =
    useTranslation();

  const {
    activeEventCategories
  }: {
    activeEventCategories: IActiveEventCategory[];
  } = useSelector((state: RootState) => state.manageEvents);

  const { eventFormData, dispatch, validationMessages }: any = props;

  const categoryChangeHandler = (
    e: React.SyntheticEvent,
    item: ISelectedItem
  ) => {
    handleEventCategoryChange(
      eventFormData,
      item,
      dispatch,
      validationMessages
    );
  };

  return (
    <div>
      <FormLabel className={EventCategoryDropdownCss['category-label']}>
        {t('addEditSchoolEvent.eventCategoryDropdown.label')}
      </FormLabel>
      <Dropdown
        id="Category-Dropdown-id"
        dataTestId="Category-Dropdown-test-id"
        selectedItem={eventFormData?.category}
        placeholderText={t(
          'addEditSchoolEvent.eventCategoryDropdown.placeholder'
        )}
        onSelect={categoryChangeHandler}
        isScrollbarVisible
        scrollbarHeight={220}
        threshold={0}
        validationText={validationMessages?.category || ''}
        validationTextLevel={
          validationMessages?.category ? ValidationTextLevel.Error : undefined
        }
        className={EventCategoryDropdownCss['category-dropdown']}
      >
        {activeEventCategories &&
          activeEventCategories?.map((item: any) => (
            <DropdownItem
              id={item?.categoryID}
              key={generateUniqueId()}
              text={item?.categoryName}
              value={item?.categoryID}
            >
              {item?.categoryName}
            </DropdownItem>
          ))}
      </Dropdown>
    </div>
  );
};

export default EventCategoryDropdown;
