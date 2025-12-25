import {
  Button,
  ButtonColor,
  ButtonSize,
  ReactionButton,
  ReactionButtonGroup
} from '@essnextgen/ui-kit';
import DialogComponent from 'shared/components/dialog';
import './customcss.scss';

type IDeleteDialogProps = {
  isOpenDialog: boolean;
  setIsOpenDialog: (isOpen: boolean) => void;
  deleteContent: any;
  deleteOptionValue: string;
  onChangeReactionBtn: (e: any, value: any) => void;
};

const DeleteDialog: React.FC<IDeleteDialogProps> = ({
  isOpenDialog,
  setIsOpenDialog,
  deleteContent,
  deleteOptionValue,
  onChangeReactionBtn
}) => {
  return (
    <DialogComponent
      dataTestId="Dialog-true"
      isOpen={isOpenDialog}
      title={deleteContent.title}
      onClose={() => setIsOpenDialog(false)}
      dialogTemplateChild={
        <div>
          <div className="deleteContentText">{deleteContent.content}</div>
          {deleteContent?.deleteOptions && (
            <div className="deleteOptionsBtns">
              <ReactionButtonGroup
                dataTestId="delete-options"
                size={ButtonSize.Small}
                selectedValue={deleteOptionValue}
              >
                {deleteContent?.deleteOptions.map(
                  (option: string, index: number) => {
                    return (
                      <ReactionButton
                        dataTestId={`reaction-btn-${index}`}
                        id={`reaction-btn-${index}`}
                        key={option}
                        className="w-33"
                        label={option}
                        value={option}
                        onChange={onChangeReactionBtn}
                      />
                    );
                  }
                )}
              </ReactionButtonGroup>
            </div>
          )}
        </div>
      }
      actionList={
        <div className="buttons">
          <Button
            dataTestId="cancle-button"
            size={ButtonSize.Medium}
            color={ButtonColor.Secondary}
            onClick={() => setIsOpenDialog(false)}
          >
            {deleteContent.secondaryBTnText}
          </Button>
          <Button
            dataTestId="Delete-button"
            size={ButtonSize.Medium}
            color={ButtonColor.Primary}
          >
            {deleteContent.primaryBTnText}
          </Button>
        </div>
      }
    />
  );
};

export default DeleteDialog;
