import {
  UseTranslationResponse,
  useTranslation
} from '@essnextgen/ui-intl-kit';
import AttendeesCss from '../style.module.scss';
import {
  FormLabel,
  Search,
  SelectedItem,
  TextInputSize
} from '@essnextgen/ui-kit';
import { attendeesSearchHandler } from '../AddEditSchoolEventUtils';
import { ISelectedAttendees } from '../AddEditSchoolEventProps';

const AttendeesView: any = (props: any) => {
  const { t }: UseTranslationResponse<'translation', undefined> =
    useTranslation();
  const {
    dispatch,
    attendeesSuggestionList,
    setAttendeesSuggestionList,
    attendeesList,
    isAttendeesLoading,
    setIsAttendeesLoading,
    selectedAttendees,
    setSelectedAttendees
  }: any = props;

  const handleSearchChange = (event: any) => {
    setIsAttendeesLoading(true);
    const searchValue = event?.target?.value || '';

    attendeesSearchHandler(
      searchValue,
      setAttendeesSuggestionList,
      attendeesList,
      dispatch,
      setIsAttendeesLoading
    );
  };

  const tagListValue: string = selectedAttendees
    ?.map((item: ISelectedAttendees) => `${item.name}`)
    .join(', ');

  const tagListValueArray: SelectedItem[] = selectedAttendees?.map(
    (item: ISelectedAttendees) => ({
      name: item?.name,
      id: item?.id
    })
  );

  const handleItemSelected = (list: ISelectedAttendees[]) => {
    setSelectedAttendees(list);
  };

  return (
    <>
      <div className={AttendeesCss['attendees-container']}>
        <FormLabel>{t('addEditSchoolEvent.attendeesView.label')}</FormLabel>
        <Search
          dataTestId="search-attendee"
          height={100}
          id="search-attendee"
          keyUpHandler={event => {
            handleSearchChange(event);
          }}
          onCloseHandle={() => null}
          onItemClick={() => {}}
          debouncerTreshold={1000}
          showLoading={isAttendeesLoading}
          noDataTemplate={t('validations.yourSearchDidNotMatchAnyResults')}
          fetchingData={t('addEditSchoolEvent.attendeesView.fetchingData')}
          onKeyUpLenght={1}
          placeholderText={''}
          size={TextInputSize.Medium}
          isShowListBox
          tagListValue={tagListValue}
          tagListValueArray={tagListValueArray}
          // existingValues={attendees}
          validationTextForExistingValue={''}
          validationTextForTagList={t(
            'addEditSchoolEvent.attendeesView.attendeeAddedInTagList'
          )}
          //validationTextLevelForTagList={ValidationTextLevel.Warning}
          tagListBoxLabelText={t('addEditSchoolEvent.attendeesView.added')}
          suggestions={attendeesSuggestionList}
          isSearchWithId
          getSelectedItems={(list: ISelectedAttendees[]) => {
            handleItemSelected(list);
          }}
          addLimit={100}
        />
      </div>
    </>
  );
};

export default AttendeesView;
