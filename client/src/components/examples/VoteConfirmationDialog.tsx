import { useState } from 'react';
import { VoteConfirmationDialog } from '../VoteConfirmationDialog';
import { Button } from '@/components/ui/button';

export default function VoteConfirmationDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>Open Vote Confirmation</Button>
      
      <VoteConfirmationDialog
        open={open}
        candidateName="আবদুল করিম"
        candidateNameEn="Abdul Karim"
        party="Jamaat-e-Islami"
        candidateNumber={101}
        hashId="JAM-134"
        onConfirm={() => {
          console.log('Vote confirmed');
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
      />
    </div>
  );
}
