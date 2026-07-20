import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout(){
  const nav = useNavigate();
  useEffect(()=>{
    // placeholder: clear auth and redirect to login
    setTimeout(()=>nav('/'),300);
  },[nav]);
  return (
    <div style={{background:'var(--color-surface)',padding:20,borderRadius:12}}>
      <h2 style={{margin:0}}>Logging out...</h2>
    </div>
  )
}
