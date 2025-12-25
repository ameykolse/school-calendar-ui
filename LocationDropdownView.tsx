import {
  Dropdown,
  DropdownItem,
  FormLabel,
  ISelectedItem
} from '@essnextgen/ui-kit';
import {
  UseTranslationResponse,
  useTranslation
} from '@essnextgen/ui-intl-kit';
import LocationCss from '../style.module.scss';
import { IRoomList } from '../AddEditSchoolEventProps';
import { RootState } from '../../../../redux/rootReducer';
import { useSelector } from 'react-redux';
import { generateUniqueId } from 'shared/util';
import { handleLocationDropdownChange } from '../AddEditSchoolEventUtils';

const LocationDropdownView: any = (props: any) => {
  const { t }: UseTranslationResponse<'translation', undefined> =
    useTranslation();

  const {
    roomsList
  }: {
    roomsList: IRoomList[];
  } = useSelector((state: RootState) => state.manageEvents);

  const { eventFormData, dispatch }: any = props;

  const locationChangeHandler = (
    e: React.SyntheticEvent,
    item: ISelectedItem
  ) => {
    handleLocationDropdownChange(eventFormData, item, dispatch);
  };

  return (
    <div className={LocationCss['location-dropdown-container']}>
      <FormLabel>
        {t('addEditSchoolEvent.locationDropdownView.label')}
      </FormLabel>
      <Dropdown
        id="Location-Dropdown-id"
        dataTestId="Location-Dropdown-test-id"
        selectedItem={eventFormData?.location}
        placeholderText={t(
          'addEditSchoolEvent.locationDropdownView.placeholder'
        )}
        onSelect={locationChangeHandler}
        isScrollbarVisible
        scrollbarHeight={220}
        threshold={0}
        validationText={''}
        validationTextLevel={undefined}
      >
        {roomsList &&
          roomsList?.map((item: any) => (
            <DropdownItem
              key={generateUniqueId()}
              text={item?.roomName}
              value={item?.externalId}
              id={item?.externalId}
            >
              {item?.roomName}
            </DropdownItem>
          ))}
      </Dropdown>
    </div>
  );
};

export default LocationDropdownView;
