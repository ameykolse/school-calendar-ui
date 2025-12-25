import {
  useTranslation,
  UseTranslationResponse
} from '@essnextgen/ui-intl-kit';
import {
  Button,
  ButtonColor,
  ButtonSize,
  Dialog,
  DialogContent,
  DialogFooter
} from '@essnextgen/ui-kit';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../redux/rootReducer';
import { setAddEditDiscardPopupOpen } from '../../../../redux/slices/manageEventSlice';
import { resetChanges } from '../AddEditSchoolEventUtils';
import DiscardCss from '../style.module.scss';

const AddEditEventDiscardPopup = (props: any) => {
  const { t }: UseTranslationResponse<'translation', undefined> =
    useTranslation();
  const dispatch: AppDispatch = useDispatch();

  const { isAddEditDiscardPopupOpen }: any = props;

  const discardCloseHandler = (): void => {
    dispatch(setAddEditDiscardPopupOpen(false));
  };

  const discardHandler = (): void => {
    resetChanges(dispatch);
  };

  return (
    <>
      <Dialog
        isOpen={isAddEditDiscardPopupOpen}
        onClose={discardCloseHandler}
        escapeExits
        title={t('addEditSchoolEvent.discardPopUp.title')}
      >
        <DialogContent>
          <div className="discard-changes-text">
            {t('addEditSchoolEvent.discardPopUp.message')}
          </div>
        </DialogContent>

        <DialogFooter className={DiscardCss['discard-popup-footerdialog']}>
          <Button
            dataTestId="discard-cancel-btn"
            size={ButtonSize.Small}
            color={ButtonColor.Secondary}
            onClick={discardCloseHandler}
          >
            {t('addEditSchoolEvent.discardPopUp.button.cancel')}
          </Button>
          <Button
            dataTestId="discard-btn"
            size={ButtonSize.Small}
            color={ButtonColor.Primary}
            onClick={discardHandler}
          >
            {t('addEditSchoolEvent.discardPopUp.button.discard')}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default AddEditEventDiscardPopup;
