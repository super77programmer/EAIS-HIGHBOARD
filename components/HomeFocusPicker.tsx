'use client';
import { useId } from 'react';
import { Check } from 'lucide-react';
import { homeFocusOptions, type HomeFocus } from '@/lib/home-focus';
export function HomeFocusPicker({value,onChange}:{value:HomeFocus;onChange:(value:HomeFocus)=>void}) {
 const id=useId();
 return <fieldset className="home-focus-picker"><legend>What interests you most?</legend><p>New announcements always come first. Your interests help organize the rest of your school day.</p><div>{homeFocusOptions.map(option=><label key={option.value} className={value===option.value?'selected':''}><input type="radio" name={id} value={option.value} checked={value===option.value} onChange={()=>onChange(option.value)}/><span><b>{option.label}</b><small>{option.description}</small></span>{value===option.value&&<Check size={19} aria-hidden="true"/>}</label>)}</div></fieldset>;
}
