"use client";
import { useActionState, useEffect } from "react";
import { deleteHospitalAction } from "@/modules/hospitales/hospital.actions";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

export default function DeleteHospitalButton({ id, nombre }: { id: number; nombre: string }) {
  const [state, formAction, isPending] = useActionState(deleteHospitalAction, null);

  useEffect(() => {
    if (state?.success) toast.success(state.message);
    else if (state && !state.success) toast.error(state.message);
  }, [state]);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!confirm(`¿Eliminar "${nombre}"?`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={isPending}
        className="btn-danger text-sm py-1.5 px-3 flex items-center gap-1"
      >
        <Trash2 size={14} />
        {isPending ? "..." : "Eliminar"}
      </button>
    </form>
  );
}