import { useState } from 'react';
import { AdditionalDetailsSidePanelView } from './event-addtional-details-panel.view';
import DeleteDialog from './delete-dailog';

const overflowMenuItemOptions = [
  { text: 'Edit', value: 'edit' },
  { text: 'Delete', value: 'delete' }
];

const repeatEventDeleteContent = {
  title: 'Delete event?',
  content: 'This event and all related data will be gone forever once deleted.',
  secondaryBTnText: 'Keep it',
  primaryBTnText: 'Delete',
  deleteOptions: [
    'This event',
    'This and all following events',
    'All events in this series'
  ]
};

const nonRepeatEventDeleteContent = {
  title: 'Delete calendar event?',
  content:
    'This calendar event and all related data will be gone forever once deleted.',
  secondaryBTnText: 'Cancel',
  primaryBTnText: 'Delete'
};

export const AdditionalDetailsSidePanel = (props: any) => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [deleteOptionValue, setDeleteOptionValue] = useState('');

  const deleteContent: any =
    props.sidePanelData?.title === 'Football Club'
      ? repeatEventDeleteContent
      : nonRepeatEventDeleteContent;

  const handleOverflowMenuClick = (e: any, selectedItem: any) => {
    if (selectedItem.value === 'delete') {
      setIsOpenDialog(true);
    } else if (selectedItem.value === 'edit') {
      if (props.handleEditEvent) {
        props.handleEditEvent(props.sidePanelData);
      }
    }
  };

  const onChangeReactionBtn = (e: any, value: any) => {
    setDeleteOptionValue(value);
  };

  return (
    <>
      <AdditionalDetailsSidePanelView
        data-testid="sidePanelTest"
        isSidePanelOpen={props.isSidePanel}
        toggleSidePanelOpen={props.toggleSidePanelOpen}
        sidePanelData={props.sidePanelData}
        isLoader={props.isLoader}
        errCodeMessage={props.errCodeMessage}
        handleOverflowMenuClick={handleOverflowMenuClick}
        overflowMenuOptions={overflowMenuItemOptions}
      />
      <DeleteDialog
        isOpenDialog={isOpenDialog}
        setIsOpenDialog={setIsOpenDialog}
        deleteContent={deleteContent}
        deleteOptionValue={deleteOptionValue}
        onChangeReactionBtn={onChangeReactionBtn}
      />
    </>
  );
};
