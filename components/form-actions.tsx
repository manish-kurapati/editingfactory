"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { ClientForm } from "@/components/brief-forms";

type Open = (pkg?: string) => void;
const FormContext = createContext<Open>(() => {});

export function FormActionsProvider({ children, compactClientSource }: { children: React.ReactNode; compactClientSource?: string }) {
  const [state, setState] = useState<{ open: boolean; pkg: string }>({ open: false, pkg: "" });
  const dialog = useRef<HTMLDialogElement>(null);
  const close = () => setState(current => ({ ...current, open: false }));

  useEffect(() => {
    if (state.open && !dialog.current?.open) dialog.current?.showModal();
    if (!state.open && dialog.current?.open) dialog.current.close();
  }, [state.open]);

  return <FormContext.Provider value={(pkg = "") => setState({ open: true, pkg })}>
    {children}
    <dialog ref={dialog} className="v2-action-dialog" aria-label="Project enquiry" onCancel={close} onClick={event => { if (event.target === dialog.current) close(); }}>
      <div className="v2-action-dialog-inner">
        <div className="v2-action-dialog-head"><div><span>START A PROJECT</span><h2>{state.pkg ? `Enquire about ${state.pkg}` : "Book an Enquiry"}</h2></div><button type="button" className="v2-dialog-close" onClick={close} aria-label="Close form"><X size={22}/></button></div>
        <div className="v2-action-dialog-scroll">{state.open && <ClientForm key={state.pkg} defaultPackage={state.pkg} source={compactClientSource}/>}</div>
      </div>
    </dialog>
  </FormContext.Provider>;
}

export function usePackageOpener() {
  return useContext(FormContext);
}

export function FormActionButton({ pkg, children, className = "" }: { kind?: "client"; pkg?: string; children: React.ReactNode; className?: string }) {
  const open = useContext(FormContext);
  return <button type="button" className={className} onClick={() => open(pkg)}>{children}</button>;
}
