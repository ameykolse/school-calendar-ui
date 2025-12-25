import { Dropdown, FormLabel } from '@essnextgen/ui-kit';
import {
  UseTranslationResponse,
  useTranslation
} from '@essnextgen/ui-intl-kit';
import RepeatComponentCss from '../style.module.scss';

const RepeatComponentView: any = () => {
  const { t }: UseTranslationResponse<'translation', undefined> =
    useTranslation();

  return (
    <div className={RepeatComponentCss['repeat-container']}>
      <FormLabel>{t('addEditSchoolEvent.repeatComponentView.label')}</FormLabel>
      <Dropdown
        selectedItem={
          {
            //   value: roomLayotVal?.value,
            //   text: roomLayotVal?.text
          }
        }
        placeholderText={t(
          'addEditSchoolEvent.repeatComponentView.doesNotRepeat'
        )}
        //className={EventCategoryDropdownCss["category-dropdown"]}
        //onSelect={handleRoomLayoutSelectionHandler}
        // validationText={
        //   spAddSeatBtnFlag && roomLayotVal?.text?.length === 0
        //     ? t("sidePanel.roomLayoutIsRequired")
        //     : ""
        // }
        // validationTextLevel={
        //   spAddSeatBtnFlag &&
        //   roomLayotVal?.text?.length === 0 &&
        //   ValidationTextLevel.Error
        // }
      >
        {/* {roomLayoutFilter &&
            roomLayoutFilter?.map((item: any) => (
                <DropdownItem
                key={uuid()}
                text={item?.roomLayoutName}
                value={item?.externalId}
                >
                {item?.roomLayoutName}
                </DropdownItem>
            ))} */}
      </Dropdown>
    </div>
  );
};

export default RepeatComponentView;
