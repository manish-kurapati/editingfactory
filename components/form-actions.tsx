"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { ClientForm, EditorForm } from "@/components/brief-forms";

type FormKind = "client" | "editor";
const FormContext = createContext<(kind: FormKind) => void>(() => {});

export function FormActionsProvider({ children }: { children: React.ReactNode }) {
  const [form, setForm] = useState<FormKind | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (form && !dialog.current?.open) dialog.current?.showModal();
    if (!form && dialog.current?.open) dialog.current.close();
  }, [form]);

  return <FormContext.Provider value={setForm}>
    {children}
    <dialog ref={dialog} className="v2-action-dialog" aria-label={form === "editor" ? "Editor application" : "Project enquiry"} onCancel={() => setForm(null)} onClick={event => { if (event.target === dialog.current) setForm(null); }}>
      <div className="v2-action-dialog-inner">
        <div className="v2-action-dialog-head"><div><span>{form === "editor" ? "JOIN THE TEAM" : "START A PROJECT"}</span><h2>{form === "editor" ? "Become an Editor" : "Book an Enquiry"}</h2></div><button type="button" className="v2-dialog-close" onClick={() => setForm(null)} aria-label="Close form"><X size={22}/></button></div>
        <div className="v2-action-dialog-scroll">{form === "editor" ? <EditorForm/> : form === "client" ? <ClientForm/> : null}</div>
      </div>
    </dialog>
  </FormContext.Provider>;
}

export function FormActionButton({ kind, children, className = "" }: { kind: FormKind; children: React.ReactNode; className?: string }) {
  const open = useContext(FormContext);
  return <button type="button" className={className} onClick={() => open(kind)}>{children}</button>;
}
