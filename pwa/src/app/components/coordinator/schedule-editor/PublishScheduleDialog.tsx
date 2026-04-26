import { CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

interface PublishScheduleDialogProps {
  onClose: () => void;
}

export function PublishScheduleDialog({ onClose }: PublishScheduleDialogProps) {
  return (
    <Dialog defaultOpen onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent aria-describedby="publish-schedule-description" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Publikuj grafik</DialogTitle>
          <DialogDescription id="publish-schedule-description">
            Potwierdź publikację harmonogramu. Po publikacji dalsze zmiany będą możliwe tylko przez procedurę zamiany dyżurów.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm text-gray-900">Wszystkie dyżury obsadzone</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm text-gray-900">Brak konfliktów walidacji</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm text-gray-900">Zgodność z limitami prawnymi</span>
          </div>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-900">Uwaga</p>
          <p className="mt-1 text-sm text-amber-800">
            Po publikacji zmiany będą możliwe tylko przez procedurę zamiany dyżurów.
          </p>
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Anuluj
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700"
          >
            Publikuj
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
